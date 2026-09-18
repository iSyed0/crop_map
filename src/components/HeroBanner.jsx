import { Clock, Target, TrendingUp } from 'lucide-react'
import Logo from './Logo.jsx'

function FieldIllustration() {
  // Lightweight inline-SVG stand-in for a farm-field photo (rows receding to a horizon + sun).
  const rows = Array.from({ length: 7 })
  return (
    <svg viewBox="0 0 600 260" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfe0c9" />
          <stop offset="100%" stopColor="#8fcf9e" />
        </linearGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4f8f52" />
          <stop offset="100%" stopColor="#2f6b38" />
        </linearGradient>
      </defs>
      <rect width="600" height="120" fill="url(#sky)" />
      <circle cx="470" cy="60" r="34" fill="#fff3c4" opacity="0.85" />
      <rect y="110" width="600" height="150" fill="url(#ground)" />
      {rows.map((_, i) => {
        const y = 130 + i * 18
        const skew = i * 3
        return (
          <path
            key={i}
            d={`M ${-20 - skew} ${y} L 620 ${y}`}
            stroke="#265c30"
            strokeWidth="3"
            opacity={0.5}
          />
        )
      })}
      {Array.from({ length: 40 }).map((_, i) => (
        <circle
          key={i}
          cx={(i * 37) % 600}
          cy={135 + ((i * 53) % 110)}
          r="2.4"
          fill="#3f7a44"
        />
      ))}
    </svg>
  )
}

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-xl mx-5 mt-3 bg-forest-900 text-white">
      <FieldIllustration />
      <div className="absolute inset-0 bg-gradient-to-r from-forest-900 via-forest-900/85 to-transparent" />

      <div className="relative flex items-center justify-between gap-6 px-6 py-4">
        <div className="max-w-xl">
          <h2 className="text-lg font-extrabold leading-tight">
            Smart Crop Detection for a Resilient Pakistan
          </h2>
          <p className="mt-1 text-xs text-white/80 max-w-md">
            Leveraging satellite technology and AI for accurate crop identification, monitoring and early risk
            assessment.
          </p>

          <div className="mt-2 flex flex-wrap gap-4 text-[11px]">
            <div className="flex items-center gap-1.5">
              <Clock size={13} /> Timely Detection
            </div>
            <div className="flex items-center gap-1.5">
              <Target size={13} /> Accurate Insights
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp size={13} /> Informed Decisions
            </div>
          </div>
        </div>

        <div className="hidden md:flex opacity-25">
          <Logo size={64} />
        </div>
      </div>
    </section>
  )
}
