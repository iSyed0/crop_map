import buildingTilesets from '../data/buildingTilesets.json'

// TileServer GL instance on the office LAN serving one vector-tile mbtiles
// per district (161 total, covering all of Pakistan) -- see
// src/data/buildingTilesets.json for the {id, bounds} manifest. Only
// reachable from that network; not usable if this app is deployed off-LAN.
export const BUILDINGS_TILESERVER_URL = import.meta.env.VITE_BUILDINGS_TILESERVER_URL || 'http://172.18.1.139:8081'

// Each district's own polygon layer, not a bounding box, so a wide low-zoom
// view doesn't fetch buildings for districts that only clip the viewport's
// corner.
const BUILDING_SOURCE_LAYER = 'buildings'
export const BUILDINGS_MIN_ZOOM = 13 // footprints are unreadable/noisy below this anyway

const sourceId = (id) => `buildings-${id}`
const fillLayerId = (id) => `buildings-${id}-fill`
const lineLayerId = (id) => `buildings-${id}-line`

function boundsIntersect(a, b) {
  return a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1]
}

function addTileset(map, tileset) {
  if (map.getSource(sourceId(tileset.id))) return
  map.addSource(sourceId(tileset.id), {
    type: 'vector',
    tiles: [`${BUILDINGS_TILESERVER_URL}/data/${tileset.id}/{z}/{x}/{y}.pbf`],
    minzoom: tileset.minzoom,
    maxzoom: tileset.maxzoom,
  })
  map.addLayer({
    id: fillLayerId(tileset.id),
    type: 'fill',
    source: sourceId(tileset.id),
    'source-layer': BUILDING_SOURCE_LAYER,
    minzoom: BUILDINGS_MIN_ZOOM,
    paint: { 'fill-color': '#d97706', 'fill-opacity': 0.55 },
  })
  map.addLayer({
    id: lineLayerId(tileset.id),
    type: 'line',
    source: sourceId(tileset.id),
    'source-layer': BUILDING_SOURCE_LAYER,
    minzoom: BUILDINGS_MIN_ZOOM,
    paint: { 'line-color': '#78350f', 'line-width': 0.5, 'line-opacity': 0.8 },
  })
}

function removeTileset(map, id) {
  if (map.getLayer(fillLayerId(id))) map.removeLayer(fillLayerId(id))
  if (map.getLayer(lineLayerId(id))) map.removeLayer(lineLayerId(id))
  if (map.getSource(sourceId(id))) map.removeSource(sourceId(id))
}

// Adds/removes per-district vector sources so only districts intersecting
// the current viewport are loaded — with 161 districts covering the whole
// country (each with real data from zoom 2 up), adding all of them
// unconditionally would mean querying every one on every pan/zoom.
// Call on toggle-on, on 'moveend' while the layer is on, and once after any
// map.setStyle() (which wipes all custom sources/layers).
export function syncBuildingLayers(map) {
  const b = map.getBounds()
  const viewport = [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()]
  const inView = buildingTilesets.filter((t) => boundsIntersect(t.bounds, viewport))
  const inViewIds = new Set(inView.map((t) => t.id))

  const currentIds = new Set(
    Object.keys(map.getStyle().sources || {})
      .filter((id) => id.startsWith('buildings-'))
      .map((id) => id.slice('buildings-'.length))
  )

  currentIds.forEach((id) => {
    if (!inViewIds.has(id)) removeTileset(map, id)
  })
  inView.forEach((tileset) => addTileset(map, tileset))
}

export function removeBuildingLayers(map) {
  const ids = Object.keys(map.getStyle().sources || {})
    .filter((id) => id.startsWith('buildings-'))
    .map((id) => id.slice('buildings-'.length))
  ids.forEach((id) => removeTileset(map, id))
}
