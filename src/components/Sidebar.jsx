import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Table,
  Crosshair,
  Bell,
  Satellite,
  BarChart2,
  LayoutGrid,
  Database,
  Users,
  Settings,
  ChevronDown,
  Headset,
} from 'lucide-react'
import Logo from './Logo.jsx'

const iconMap = {
  'layout-dashboard': LayoutDashboard,
  table: Table,
  crosshair: Crosshair,
  bell: Bell,
  satellite: Satellite,
  'bar-chart-2': BarChart2,
  'layout-grid': LayoutGrid,
  database: Database,
  users: Users,
  settings: Settings,
}

const navItems = [
  { label: 'Dashboard', icon: 'layout-dashboard', path: '/' },
  { label: 'Crop Overview', icon: 'table', path: '/crop-overview' },
  {
    label: 'Crop Detection',
    icon: 'crosshair',
    path: '/crop-detection',
    children: [
      { label: 'Run Detection', path: '/crop-detection' },
      { label: 'Detection History', path: '/crop-detection/history' },
    ],
  },
  { label: 'Monitoring & Alerts', icon: 'bell', path: '/monitoring-alerts' },
  { label: 'Satellite Imagery', icon: 'satellite', path: '/satellite-imagery' },
  { label: 'Reports & Analytics', icon: 'bar-chart-2', path: '/reports-analytics' },
  { label: 'District Dashboard', icon: 'layout-grid', path: '/district-dashboard' },
  { label: 'Data Management', icon: 'database', path: '/data-management' },
  { label: 'User Management', icon: 'users', path: '/user-management' },
  { label: 'Settings', icon: 'settings', path: '/settings' },
]

export default function Sidebar() {
  const location = useLocation()
  const [openMenu, setOpenMenu] = useState(
    () => navItems.find((i) => i.children?.some((c) => c.path === location.pathname))?.label ?? null
  )

  const linkClasses = (isActive) =>
    `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
      isActive ? 'bg-forest-600 text-white font-medium' : 'text-white/70 hover:bg-white/5 hover:text-white'
    }`

  return (
    <aside className="hidden lg:flex lg:flex-col w-[230px] shrink-0 bg-forest-900 text-white h-screen overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
        <Logo size={56} className="shrink-0" />
        <div className="leading-tight">
          <p className="font-bold text-[17px] tracking-wide">NDMA</p>
          <p className="text-[11px] text-white/60 -mt-0.5">PAKISTAN</p>
          <p className="text-[9px] text-white/40 -mt-0.5">Disaster Management Authority</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon]

          if (!item.children) {
            return (
              <NavLink key={item.label} to={item.path} end={item.path === '/'} className={({ isActive }) => linkClasses(isActive)}>
                <Icon size={17} className="shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
              </NavLink>
            )
          }

          const isOpen = openMenu === item.label
          const isChildActive = item.children.some((c) => c.path === location.pathname)

          return (
            <div key={item.label}>
              <button
                onClick={() => setOpenMenu(isOpen ? null : item.label)}
                className={linkClasses(isChildActive && !isOpen)}
                aria-expanded={isOpen}
              >
                <Icon size={17} className="shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronDown size={14} className={`opacity-60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="mt-1 ml-8 space-y-1 border-l border-white/10 pl-3">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      end
                      className={({ isActive }) =>
                        `block px-2 py-1.5 rounded text-xs transition-colors ${
                          isActive ? 'text-white font-medium' : 'text-white/60 hover:text-white'
                        }`
                      }
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-3">
        <div className="flex items-center gap-3 text-white/80 text-xs">
          <Headset size={22} />
          <div>
            <p className="font-medium text-white">Need Help?</p>
            <p>Contact NDMA</p>
          </div>
        </div>
        <button className="w-full bg-forest-600 hover:bg-forest-500 transition-colors rounded-lg py-2.5 text-sm font-semibold">
          HELPLINE 1122
        </button>
      </div>
    </aside>
  )
}
