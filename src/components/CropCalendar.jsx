import { Sprout, Check, Flower2, Wheat } from 'lucide-react'
import { cropCalendar } from '../data/mock.js'

const iconMap = {
  Sowing: Sprout,
  Growing: Check,
  Flowering: Flower2,
  Harvesting: Wheat,
}

const statusStyles = {
  done: 'bg-forest-600 text-white',
  active: 'bg-forest-600 text-white ring-4 ring-forest-500/30',
  upcoming: 'bg-surface-700 text-gray-500',
}

export default function CropCalendar() {
  return (
    <div className="bg-surface-800 rounded-xl border border-surface-600 shadow-card p-3">
      <h3 className="text-sm font-semibold text-gray-50 mb-3">Crop Calendar (Kharif 2024)</h3>
      <div className="flex items-start justify-between relative px-1">
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-surface-600 -z-0" />
        {cropCalendar.map((c) => {
          const Icon = iconMap[c.label]
          return (
            <div key={c.label} className="flex flex-col items-center gap-1 relative z-10 flex-1">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center ${statusStyles[c.status]}`}>
                <Icon size={14} />
              </span>
              <p className="text-xs font-semibold text-gray-100">{c.label}</p>
              <p className="text-[10px] text-gray-400">{c.range}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
