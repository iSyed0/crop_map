// Deterministic pseudo-random crop-detection points scattered roughly across
// Pakistan's cultivated belt (Indus plain), color-coded by dominant crop —
// stand-in for a real Sentinel-2 classification layer.
const PALETTE = [
  { crop: 'Rice', color: '#1a7a34' },
  { crop: 'Maize', color: '#2f9e44' },
  { crop: 'Cotton', color: '#e6c419' },
  { crop: 'Sugarcane', color: '#e8912b' },
  { crop: 'Wheat', color: '#d1442f' },
  { crop: 'Other Crops', color: '#8a8a8a' },
]

function seededRandom(seed) {
  let t = seed + 0x6d2b79f5
  return function () {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

export function buildCropPointsGeoJSON(count = 260) {
  const rand = seededRandom(42)
  const features = []
  for (let i = 0; i < count; i++) {
    // Bias points into the Indus-plain band (roughly lon 66-75, lat 24-34)
    const lon = 66 + rand() * 9
    const lat = 24 + rand() * 10
    const p = PALETTE[Math.floor(rand() * PALETTE.length)]
    features.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [lon, lat] },
      properties: { crop: p.crop, color: p.color },
    })
  }
  return { type: 'FeatureCollection', features }
}

export const cropLegend = [
  ...PALETTE,
  { crop: 'No Crop', color: '#d9d9d9' },
]

export const majorCities = [
  { label: 'Peshawar', lon: 71.5249, lat: 34.0151 },
  { label: 'Islamabad', lon: 73.0479, lat: 33.6844 },
  { label: 'Lahore', lon: 74.3587, lat: 31.5497 },
  { label: 'Quetta', lon: 66.975, lat: 30.1798 },
  { label: 'Karachi', lon: 67.0011, lat: 24.8607 },
]

// Matches the bounding box of public/pakistan-boundary.geojson (converted from
// the National_Boundary.shp provided in the project).
export const PAKISTAN_BOUNDS = [
  [60.89, 23.7],
  [79.31, 37.1],
]
