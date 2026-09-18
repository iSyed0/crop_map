import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { initEarthEngine } from './ee.js'
import { getTilePreview, getTimeseries } from './vegetation.js'

const app = express()
app.use(cors())

function defaultStartISO() {
  const d = new Date()
  d.setUTCMonth(d.getUTCMonth() - 6) // 6 months back covers roughly one growing season
  return d.toISOString().slice(0, 10)
}
function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

app.get('/api/health', async (req, res) => {
  try {
    await initEarthEngine()
    res.json({ ok: true, earthEngine: 'initialized' })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

// GET /api/vegetation/tile?index=ndvi|evi&date=YYYY-MM-DD
// Returns an XYZ tile URL template for the latest MODIS composite on/before `date`.
app.get('/api/vegetation/tile', async (req, res) => {
  try {
    const index = String(req.query.index || 'ndvi').toLowerCase()
    const result = await getTilePreview(index, req.query.date)
    res.json(result)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// GET /api/vegetation/timeseries?lat=&lon=&index=ndvi|evi&start=&end=
// Returns [{ date, value }] — mean index value at the point for each MODIS composite in range.
app.get('/api/vegetation/timeseries', async (req, res) => {
  try {
    const { lat, lon, start, end } = req.query
    const index = String(req.query.index || 'ndvi').toLowerCase()
    if (lat == null || lon == null) {
      return res.status(400).json({ error: 'lat and lon query params are required' })
    }
    const points = await getTimeseries({
      lat: Number(lat),
      lon: Number(lon),
      start: start || defaultStartISO(),
      end: end || todayISO(),
      indexKey: index,
    })
    res.json({ index, lat: Number(lat), lon: Number(lon), points })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 4310
app.listen(PORT, () => {
  console.log(`Vegetation-index API listening on http://localhost:${PORT}`)
})
