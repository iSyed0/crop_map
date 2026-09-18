// Islamabad crop/land-cover classification layer — dissolved + reprojected
// from the user-supplied "class new.geojson" (309k raster-derived polygons,
// EPSG:32643) down to one (multi)polygon per class in EPSG:4326.
export const CLASSIFICATION_LABELS = {
  1: { label: 'Bare / Built-up', color: '#9e9e8f' },
  2: { label: 'Corn', color: '#f2c230' },
  3: { label: 'Cotton', color: '#eef0e2' },
  4: { label: 'Grass / Pasture', color: '#a3d977' },
  5: { label: 'Jowar / Sorghum', color: '#c98a3a' },
  6: { label: 'Pulses', color: '#7a8f3f' },
  7: { label: 'Rice', color: '#2e8b57' },
  8: { label: 'Soybeans', color: '#4caf50' },
  9: { label: 'Sugarcane', color: '#1f7a3d' },
  10: { label: 'Sunflower', color: '#ffcc33' },
  11: { label: 'Tree Cover', color: '#1b5e20' },
  12: { label: 'Water', color: '#3a8fd9' },
}

export const CLASSIFICATION_URL = '/islamabad-classification.geojson'

// Islamabad Capital Territory — roughly matches the classification's extent.
export const ISLAMABAD_CENTER = [73.05, 33.65]

// Adds the classification source/layers to the map the first time it's needed
// (~23MB — not worth fetching on every page load), and is a no-op afterwards.
export function ensureClassificationLayer(map) {
  if (map.getSource('classification')) return

  const dnColorMatch = ['match', ['get', 'DN']]
  Object.entries(CLASSIFICATION_LABELS).forEach(([dn, info]) => {
    dnColorMatch.push(Number(dn), info.color)
  })
  dnColorMatch.push('#cccccc') // fallback

  map.addSource('classification', {
    type: 'geojson',
    data: CLASSIFICATION_URL,
  })
  map.addLayer({
    id: 'classification-fill',
    type: 'fill',
    source: 'classification',
    paint: {
      'fill-color': dnColorMatch,
      'fill-opacity': 0.75,
    },
  })
  map.addLayer({
    id: 'classification-line',
    type: 'line',
    source: 'classification',
    paint: {
      'line-color': '#ffffff',
      'line-width': 0.4,
      'line-opacity': 0.5,
    },
  })
}
