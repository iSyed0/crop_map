import { Sprout, Leaf, MapPin, AlertTriangle, FileText, TrendingUp } from 'lucide-react'
import { stats } from '../data/mock.js'

const iconMap = {
  sprout: Sprout,
  leaf: Leaf,
  'map-pin': MapPin,
  'alert-triangle': AlertTriangle,
  'file-text': FileText,
}

const bgMap = {
  sprout: 'bg-emerald-500/15 text-emerald-400',
  leaf: 'bg-green-500/15 text-green-400',
  'map-pin': 'bg-teal-500/15 text-teal-400',
  'alert-triangle': 'bg-orange-500/15 text-orange-400',
  'file-text': 'bg-blue-500/15 text-blue-400',
}

export default function StatCards() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 px-5 mt-3">
      {stats.map((s) => {
        const Icon = iconMap[s.icon]
        return (
          <div key={s.label} className="bg-surface-800 rounded-lg border border-surface-600 shadow-card p-3 flex items-start gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${bgMap[s.icon]}`}>
              <Icon size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-400 leading-tight truncate">{s.label}</p>
              <p className="text-lg font-bold text-gray-50 leading-tight">
                {s.value} <span className="text-xs font-medium text-gray-400">{s.unit}</span>
              </p>
              <p className={`text-[10px] flex items-center gap-1 ${s.trendUp ? 'text-emerald-400' : 'text-gray-500'}`}>
                {s.trendUp && <TrendingUp size={10} />}
                {s.trend}
              </p>
            </div>
          </div>
        )
      })}
    </section>
  )
}
