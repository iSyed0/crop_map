import { AlertTriangle } from 'lucide-react'
import { alerts } from '../data/mock.js'

const severityStyles = {
  High: 'bg-red-50 text-red-600',
  Medium: 'bg-amber-50 text-amber-600',
}

const iconStyles = {
  High: 'bg-red-100 text-red-600',
  Medium: 'bg-amber-100 text-amber-600',
}

export default function RecentAlerts() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-card p-3">
      <div className="flex items-center justify-between mb-1.5">
        <h3 className="text-sm font-semibold text-gray-900">Recent Alerts</h3>
        <button className="text-[11px] font-medium text-forest-700 border border-forest-200 rounded-lg px-2 py-0.5 hover:bg-forest-50">
          View All
        </button>
      </div>

      <ul className="divide-y divide-gray-100">
        {alerts.map((a) => (
          <li key={a.title} className="flex items-start gap-2 py-1.5">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${iconStyles[a.severity]}`}>
              <AlertTriangle size={12} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">{a.title}</p>
              <p className="text-[10px] text-gray-500 truncate">{a.district}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] text-gray-400">{a.date}</p>
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
