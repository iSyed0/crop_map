// NDVI/EVI from MODIS, computed live on Earth Engine's servers per request.
//
// Product: MODIS/061/MOD13Q1 — Terra, 16-day composite, 250m, bands NDVI and
// EVI scaled by 1e-4. https://developers.google.com/earth-engine/datasets/catalog/MODIS_061_MOD13Q1
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ee, { initEarthEngine, evaluate } from './ee.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const MODIS_COLLECTION = 'MODIS/061/MOD13Q1'
const SCALE = 0.0001
const INDEX_BANDS = { ndvi: 'NDVI', evi: 'EVI' }

// A single MODIS composite is a whole-globe mosaic already, so "the latest
// image" is all we need — no need to composite across dates ourselves.
// 60 days of lookback comfortably covers the ~16-day cadence plus MODIS's
// processing/ingestion latency.
const LOOKBACK_DAYS = 60

// The real Pakistan national boundary (incl. Jammu & Kashmir, per Pakistan's
// official national boundary dataset), not a bounding box — a rectangle
// would spill into Afghanistan/Iran/India/China at the corners.
//
// Sourced from data/pakistan-boundary.geojson: the government's own
// Pakistan_National.geojson (mainland + J&K + minor islands, ~82k vertices
// combined), unioned and simplified to ~5.8k vertices at data/build-boundary.py
// (well under MODIS's 250m pixel size, so no visible loss of accuracy) so it's
// small enough to embed inline in every Earth Engine request. Loaded once at
// module scope — this is plain JSON parsing, not an ee.* call, so it's safe
// before initEarthEngine().
const boundaryGeojsonPath = path.join(__dirname, '..', 'data', 'pakistan-boundary.geojson')
const boundaryGeojson = JSON.parse(fs.readFileSync(boundaryGeojsonPath, 'utf8'))

// Built lazily (not at module scope) — any ee.* constructor call reaches out
// to Earth Engine's API, which throws if it runs before initEarthEngine().
function pakistanBoundary() {
  return ee.Geometry(boundaryGeojson.features[0].geometry)
}

// Standard Earth Engine NDVI ramp (white/brown -> yellow -> dark green).
// Reused for EVI too so the two layers read consistently on the map.
const PALETTE = [
  'ffffff',
  'ce7e45',
  'df923d',
  'f1b555',
  'fcd163',
  '99b718',
  '74a901',
  '66a000',
  '529400',
  '3e8601',
  '207401',
  '056201',
  '004c00',
  '023b01',
  '012e01',
  '011d01',
  '011301',
]
const VIS = { min: 0, max: 0.9, palette: PALETTE }

function assertIndex(indexKey) {
  const band = INDEX_BANDS[indexKey]
  if (!band) throw new Error(`Unknown index "${indexKey}" — expected "ndvi" or "evi"`)
  return band
}

function getMapId(image, visParams) {
  return new Promise((resolve, reject) => {
    image.getMap(visParams, (map, err) => (err ? reject(new Error(err)) : resolve(map)))
  })
}

async function getLatestImage(indexKey, endDateStr) {
  const band = assertIndex(indexKey)
  await initEarthEngine()

  const end = endDateStr ? ee.Date(endDateStr) : ee.Date(Date.now())
  const start = end.advance(-LOOKBACK_DAYS, 'day')

  const collection = ee.ImageCollection(MODIS_COLLECTION).filterDate(start, end).select(band)

  const size = await evaluate(collection.size())
  if (size === 0) {
    throw new Error(
      `No MODIS composite found for "${indexKey}" in the ${LOOKBACK_DAYS} days before ${endDateStr || 'today'}.`
    )
  }

  const latest = ee.Image(collection.sort('system:time_start', false).first())
  const dateMillis = await evaluate(latest.get('system:time_start'))

  // Plain .clip() on the raw image fails here: MODIS is natively in a
  // sinusoidal projection (SR-ORG:6974), and transforming Pakistan's
  // ~20k-vertex polygon edges into that grid can't always be solved exactly
  // ("Unable to transform edge ... to EPSG:4326"). Reprojecting to a plain
  // lat/lon grid *before* clipping makes the edge transform EPSG:4326 ->
  // EPSG:4326 (trivial), then .clip() masks out everything beyond the
  // polygon — unlike clipToBoundsAndScale, which only crops to Pakistan's
  // bounding *rectangle* and leaves neighboring countries' pixels opaque.
  const clipped = latest
    .multiply(SCALE)
    .rename(indexKey)
    .reproject({ crs: 'EPSG:4326', scale: 250 })
    .clip(pakistanBoundary())

  return {
    image: clipped,
    date: new Date(dateMillis).toISOString().slice(0, 10),
  }
}

// Returns an XYZ tile URL template the frontend can drop straight into a
// Mapbox GL raster source.
export async function getTilePreview(indexKey, endDateStr) {
  const { image, date } = await getLatestImage(indexKey, endDateStr)
  const map = await getMapId(image, VIS)
  return {
    index: indexKey,
    date,
    tileUrlTemplate: map.urlFormat,
    min: VIS.min,
    max: VIS.max,
    palette: PALETTE.map((c) => `#${c}`),
  }
}

// Mean index value at a point (a MODIS pixel is ~250m, so a point is
// effectively "the pixel this point falls in") for every composite in range.
export async function getTimeseries({ lat, lon, start, end, indexKey }) {
  const band = assertIndex(indexKey)
  await initEarthEngine()

  const point = ee.Geometry.Point([lon, lat])
  const collection = ee.ImageCollection(MODIS_COLLECTION).filterDate(start, end).filterBounds(point).select(band)

  const features = collection.map((img) => {
    const meanDict = img.reduceRegion({ reducer: ee.Reducer.mean(), geometry: point, scale: 250 })
    return ee.Feature(null, {
      date: img.date().format('YYYY-MM-dd'),
      value: ee.Number(meanDict.get(band)).multiply(SCALE),
    })
  })

  const result = await evaluate(ee.FeatureCollection(features))
  return result.features
    .map((f) => f.properties)
    .filter((p) => p.value != null)
    .sort((a, b) => a.date.localeCompare(b.date))
}
