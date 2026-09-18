import { Megaphone, Calendar, MapPin } from 'lucide-react'
import { announcement } from '../data/mock.js'

export default function Announcements() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-card p-3">
      <div className="flex items-center justify-between mb-1.5">
        <h3 className="text-sm font-semibold text-gray-900">Announcements</h3>
        <button className="text-[11px] font-medium text-forest-700 border border-forest-200 rounded-lg px-2 py-0.5 hover:bg-forest-50">
          View All
        </button>
      </div>

      <div className="bg-forest-50 rounded-lg p-2.5 flex gap-2">
        <span className="w-7 h-7 rounded-full bg-forest-600 text-white flex items-center justify-center shrink-0">
          <Megaphone size={13} />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-gray-900 leading-tight">{announcement.title}</p>
          <p className="text-[10px] text-gray-600 mt-0.5 leading-snug">{announcement.body}</p>
          <div className="flex items-center gap-3 text-[10px] text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <Calendar size={10} /> {announcement.date}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={10} /> {announcement.location}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
