import { ChevronDown } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { trendData } from '../data/mock.js'

export default function TrendChart() {
  return (
    <div className="bg-surface-800 rounded-xl border border-surface-600 shadow-card p-3 flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-gray-50">Crop Detection Trend</h3>
        <button className="flex items-center gap-1 text-[11px] border border-surface-600 rounded-lg px-2 py-0.5 text-gray-300">
          Kharif 2024 <ChevronDown size={11} />
        </button>
      </div>

      <div style={{ height: 140 }} className="mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#22302a" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              domain={[0, 25]}
              ticks={[0, 5, 10, 15, 20, 25]}
              label={{ value: 'Area (M ha)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#7b8983' }}
            />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, background: '#111b16', border: '1px solid #293a30' }}
              labelStyle={{ color: '#e5e7eb' }}
              itemStyle={{ color: '#e5e7eb' }}
            />
            <Line type="monotone" dataKey="current" stroke="#1f9350" strokeWidth={2.5} dot={{ r: 3, fill: '#1f9350' }} />
            <Line
              type="monotone"
              dataKey="last"
              stroke="#7b8983"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: '#7b8983' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 text-[11px] text-gray-400 mt-1">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-forest-500 inline-block rounded" /> Current Season
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-gray-500 inline-block rounded" style={{ borderTop: '1px dashed' }} /> Last
          Season
        </span>
      </div>
    </div>
  )
}
