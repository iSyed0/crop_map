import { Construction } from 'lucide-react'

export default function PlaceholderPage({ icon: Icon, title, description }) {
  return (
    <div className="px-5 py-6">
      <div className="flex items-center gap-3 mb-1">
        {Icon && (
          <span className="w-9 h-9 rounded-lg bg-forest-50 text-forest-700 flex items-center justify-center shrink-0">
            <Icon size={18} />
          </span>
        )}
        <h1 className="text-lg font-bold text-gray-900">{title}</h1>
      </div>
      {description && <p className="text-sm text-gray-500 mb-6 ml-12">{description}</p>}

      <div className="bg-white rounded-xl border border-gray-100 shadow-card p-10 flex flex-col items-center justify-center text-center gap-3 min-h-[320px]">
        <span className="w-14 h-14 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
          <Construction size={26} />
        </span>
        <p className="text-sm font-semibold text-gray-800">This section is coming soon</p>
        <p className="text-xs text-gray-500 max-w-sm">
          {title} is wired up and ready — the underlying data and UI for this page haven't been built out yet.
        </p>
      </div>
    </div>
  )
}
