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
  sprout: 'bg-emerald-50 text-emerald-700',
  leaf: 'bg-green-50 text-green-700',
  'map-pin': 'bg-teal-50 text-teal-700',
  'alert-triangle': 'bg-orange-50 text-orange-600',
  'file-text': 'bg-blue-50 text-blue-700',
}

export default function StatCards() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 px-5 mt-3">
      {stats.map((s) => {
        const Icon = iconMap[s.icon]
        return (
          <div key={s.label} className="bg-white rounded-lg border border-gray-100 shadow-card p-3 flex items-start gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${bgMap[s.icon]}`}>
              <Icon size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-500 leading-tight truncate">{s.label}</p>
              <p className="text-lg font-bold text-gray-900 leading-tight">
                {s.value} <span className="text-xs font-medium text-gray-500">{s.unit}</span>
              </p>
              <p className={`text-[10px] flex items-center gap-1 ${s.trendUp ? 'text-emerald-600' : 'text-gray-400'}`}>
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
