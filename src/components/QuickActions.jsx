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
    <div className="bg-surface-800 rounded-xl border border-surface-600 shadow-card p-3">
      <h3 className="text-sm font-semibold text-gray-50 mb-2">Quick Actions</h3>
      <div className="grid grid-cols-3 gap-1.5">
        {actions.map((a) => (
          <button
            key={a.label}
            className="flex flex-col items-center gap-1 text-center rounded-lg py-2 px-1 hover:bg-forest-900/40 transition-colors"
          >
            <span className="w-8 h-8 rounded-full bg-forest-500/15 text-forest-400 flex items-center justify-center">
              <a.icon size={15} />
            </span>
            <span className="text-[10px] text-gray-400 leading-tight">
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
