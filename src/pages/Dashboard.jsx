import HeroBanner from '../components/HeroBanner.jsx'
import StatCards from '../components/StatCards.jsx'
import CropMapOverview from '../components/CropMapOverview.jsx'
import TrendChart from '../components/TrendChart.jsx'
import VegetationTrendChart from '../components/VegetationTrendChart.jsx'
import RecentAlerts from '../components/RecentAlerts.jsx'
import QuickActions from '../components/QuickActions.jsx'
import CropCalendar from '../components/CropCalendar.jsx'
import Announcements from '../components/Announcements.jsx'

export default function Dashboard() {
  return (
    <div className="pb-3">
      <HeroBanner />
      <StatCards />

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-3 px-5 mt-3 items-start">
        <div className="xl:col-span-2">
          <CropMapOverview />
        </div>
        <div className="flex flex-col gap-3">
          <TrendChart />
          <VegetationTrendChart />
          <RecentAlerts />
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-3 px-5 mt-3 items-start">
        <QuickActions />
        <CropCalendar />
        <Announcements />
      </section>
    </div>
  )
}
