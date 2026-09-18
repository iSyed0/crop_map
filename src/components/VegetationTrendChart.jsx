import { useEffect, useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ISLAMABAD_CENTER } from '../lib/classification.js'
import { fetchVegetationTimeseries } from '../lib/vegetationApi.js'

// Merges the two series into one array Recharts can plot as two lines:
// [{ date, ndvi, evi }, ...]
function mergeSeries(ndviPoints, eviPoints) {
  const byDate = new Map()
  ndviPoints.forEach((p) => byDate.set(p.date, { date: p.date, ndvi: p.value }))
  eviPoints.forEach((p) => {
    const row = byDate.get(p.date) || { date: p.date }
    row.evi = p.value
    byDate.set(p.date, row)
  })
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date))
}

export default function VegetationTrendChart() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    const [lon, lat] = ISLAMABAD_CENTER
    Promise.all([
      fetchVegetationTimeseries({ lat, lon, index: 'ndvi' }),
      fetchVegetationTimeseries({ lat, lon, index: 'evi' }),
    ])
      .then(([ndvi, evi]) => {
        if (cancelled) return
        setData(mergeSeries(ndvi.points, evi.points))
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-card p-3 flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-gray-900">NDVI / EVI Trend</h3>
        <span className="text-[10px] text-gray-400">Islamabad · MODIS</span>
      </div>

      {loading ? (
        <div className="h-[140px] flex items-center justify-center text-gray-400">
          <Loader2 size={18} className="animate-spin" />
        </div>
      ) : error ? (
        <div className="h-[140px] flex flex-col items-center justify-center gap-1.5 text-center px-4">
          <AlertTriangle size={18} className="text-amber-500" />
          <p className="text-[11px] text-gray-500">{error}</p>
        </div>
      ) : (
        <div style={{ height: 140 }} className="mt-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#eef2ef" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} minTickGap={30} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                domain={[0, 1]}
                ticks={[0, 0.25, 0.5, 0.75, 1]}
              />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Line type="monotone" dataKey="ndvi" stroke="#1a7a44" strokeWidth={2.5} dot={false} connectNulls />
              <Line type="monotone" dataKey="evi" stroke="#e6c419" strokeWidth={2} dot={false} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="flex items-center gap-4 text-[11px] text-gray-600 mt-1">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-forest-600 inline-block rounded" /> NDVI
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 inline-block rounded" style={{ backgroundColor: '#e6c419' }} /> EVI
        </span>
      </div>
    </div>
  )
}
