import { AlertTriangle } from 'lucide-react'
import { alerts } from '../data/mock.js'

const severityStyles = {
  High: 'bg-red-500/15 text-red-400',
  Medium: 'bg-amber-500/15 text-amber-400',
}

const iconStyles = {
  High: 'bg-red-500/20 text-red-400',
  Medium: 'bg-amber-500/20 text-amber-400',
}

export default function RecentAlerts() {
  return (
    <div className="bg-surface-800 rounded-xl border border-surface-600 shadow-card p-3">
      <div className="flex items-center justify-between mb-1.5">
        <h3 className="text-sm font-semibold text-gray-50">Recent Alerts</h3>
        <button className="text-[11px] font-medium text-forest-400 border border-forest-700 rounded-lg px-2 py-0.5 hover:bg-forest-900/40">
          View All
        </button>
      </div>

      <ul className="divide-y divide-surface-600">
        {alerts.map((a) => (
          <li key={a.title} className="flex items-start gap-2 py-1.5">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${iconStyles[a.severity]}`}>
              <AlertTriangle size={12} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-100 truncate">{a.title}</p>
              <p className="text-[10px] text-gray-400 truncate">{a.district}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] text-gray-500">{a.date}</p>
              <span className={`inline-block mt-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${severityStyles[a.severity]}`}>
                {a.severity}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
