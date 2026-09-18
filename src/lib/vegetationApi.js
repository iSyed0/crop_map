// Client for the Earth Engine-backed vegetation-index API (see server/README.md).
// Never talks to Earth Engine directly from the browser — the private key
// lives only on that server.
const API_BASE = import.meta.env.VITE_VEGETATION_API_URL || 'http://localhost:4000'

async function request(path) {
  let res
  try {
    res = await fetch(`${API_BASE}${path}`)
  } catch {
    throw new Error(`Can't reach the vegetation-index API at ${API_BASE} — is "npm run dev" running in server/?`)
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Vegetation-index API request failed (${res.status})`)
  }
  return res.json()
}

// -> { index, date, tileUrlTemplate, min, max, palette }
export function fetchVegetationTile(index, date) {
  const params = new URLSearchParams({ index })
  if (date) params.set('date', date)
  return request(`/api/vegetation/tile?${params}`)
}

// -> { index, lat, lon, points: [{ date, value }] }
export function fetchVegetationTimeseries({ lat, lon, start, end, index }) {
  const params = new URLSearchParams({ lat: String(lat), lon: String(lon), index })
  if (start) params.set('start', start)
  if (end) params.set('end', end)
  return request(`/api/vegetation/timeseries?${params}`)
}
