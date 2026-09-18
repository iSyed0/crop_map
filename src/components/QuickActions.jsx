import { Crosshair, Satellite, FileText, Download, TrendingUp } from 'lucide-react'

const actions = [
  { label: 'Run New', sub: 'Crop Detection', icon: Crosshair },
  { label: 'View Satellite', sub: 'Imagery', icon: Satellite },
  { label: 'Generate', sub: 'Report', icon: FileText },
  { label: 'Download', sub: 'Data', icon: Download },
  { label: 'Advance', sub: 'Analytics', icon: TrendingUp },
]

export default function QuickActions() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-card p-3">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">Quick Actions</h3>
      <div className="grid grid-cols-3 gap-1.5">
        {actions.map((a) => (
          <button
            key={a.label}
            className="flex flex-col items-center gap-1 text-center rounded-lg py-2 px-1 hover:bg-forest-50 transition-colors"
          >
            <span className="w-8 h-8 rounded-full bg-forest-50 text-forest-700 flex items-center justify-center">
              <a.icon size={15} />
            </span>
            <span className="text-[10px] text-gray-600 leading-tight">
              {a.label}
              <br />
              {a.sub}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
