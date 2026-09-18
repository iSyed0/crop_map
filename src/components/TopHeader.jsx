import { Bell, ChevronDown, UserCircle2 } from 'lucide-react'

export default function TopHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 bg-white border-b border-gray-200 shrink-0">
      <div>
        <h1 className="text-base font-bold text-gray-900 leading-tight">Crop Detection & Monitoring Portal</h1>
        <p className="text-[11px] text-gray-500 leading-tight">Early Detection. Timely Action. Resilient Pakistan.</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1.5 text-xs text-gray-700 border border-gray-200 rounded-lg px-2.5 py-1 hover:bg-gray-50">
          <span className="text-sm">🇵🇰</span> Pakistan <ChevronDown size={12} />
        </button>

        <button className="relative text-gray-500 hover:text-gray-700">
          <Bell size={18} />
          <span className="absolute -top-1.5 -right-1.5 bg-forest-600 text-white text-[9px] rounded-full w-3.5 h-3.5 flex items-center justify-center">
            3
          </span>
        </button>

        <div className="flex items-center gap-2">
          <UserCircle2 size={26} className="text-gray-400" />
          <div className="leading-tight">
            <p className="text-xs font-medium text-gray-900">Admin User</p>
            <p className="text-[10px] text-gray-500">NDMA</p>
          </div>
          <ChevronDown size={12} className="text-gray-400" />
        </div>
      </div>
    </header>
  )
}
