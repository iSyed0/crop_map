import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="px-5 py-16 flex flex-col items-center justify-center text-center gap-3">
      <span className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
        <AlertTriangle size={26} />
      </span>
      <p className="text-sm font-semibold text-gray-800">Page not found</p>
      <Link to="/" className="text-xs text-forest-700 font-medium hover:underline">
        Back to Dashboard
      </Link>
    </div>
  )
}
