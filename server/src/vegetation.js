// NDVI/EVI from MODIS, computed live on Earth Engine's servers per request.
//
// Product: MODIS/061/MOD13Q1 — Terra, 16-day composite, 250m, bands NDVI and
// EVI scaled by 1e-4. https://developers.google.com/earth-engine/datasets/catalog/MODIS_061_MOD13Q1
import ee, { initEarthEngine, evaluate } from './ee.js'

const MODIS_COLLECTION = 'MODIS/061/MOD13Q1'
const SCALE = 0.0001
const INDEX_BANDS = { ndvi: 'NDVI', evi: 'EVI' }

// A single MODIS composite is a whole-globe mosaic already, so "the latest
// image" is all we need — no need to composite across dates ourselves.
// 60 days of lookback comfortably covers the ~16-day cadence plus MODIS's
// processing/ingestion latency.
const LOOKBACK_DAYS = 60

// The real Pakistan national boundary, not a bounding box — a rectangle
// would spill into Afghanistan/Iran/India/China at the corners. Pulled from
// Earth Engine's own boundary table (already hosted server-side, so this
// never needs our ~20k-vertex shapefile transferred anywhere) rather than
// src/lib/cropPoints.js's PAKISTAN_BOUNDS, which is just a map-fitting box.
// Built lazily (not at module scope) — any ee.* constructor call reaches out
// to Earth Engine's API, which throws if it runs before initEarthEngine().
function pakistanBoundary() {
  return ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017').filter(ee.Filter.eq('country_co', 'PK')).geometry()
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

  // Plain .clip() fails here: MODIS is natively in a sinusoidal projection
  // (SR-ORG:6974), and reprojecting a large lat/lon rectangle's edges into
  // that grid can't always be solved exactly ("Unable to transform edge ...
  // to EPSG:4326"). clipToBoundsAndScale reprojects the image to the clip
  // geometry's CRS first, which sidesteps that edge-transform entirely.
  const clipped = latest.multiply(SCALE).rename(indexKey).clipToBoundsAndScale({
    geometry: pakistanBoundary(),
    scale: 250,
  })

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
