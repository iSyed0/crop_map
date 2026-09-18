import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import TopHeader from './components/TopHeader.jsx'
import Footer from './components/Footer.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CropOverview from './pages/CropOverview.jsx'
import CropDetection from './pages/CropDetection.jsx'
import DetectionHistory from './pages/DetectionHistory.jsx'
import MonitoringAlerts from './pages/MonitoringAlerts.jsx'
import SatelliteImagery from './pages/SatelliteImagery.jsx'
import ReportsAnalytics from './pages/ReportsAnalytics.jsx'
import DistrictDashboard from './pages/DistrictDashboard.jsx'
import DataManagement from './pages/DataManagement.jsx'
import UserManagement from './pages/UserManagement.jsx'
import Settings from './pages/Settings.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <div className="h-screen flex overflow-hidden bg-[#f4f6f5]">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/crop-overview" element={<CropOverview />} />
            <Route path="/crop-detection" element={<CropDetection />} />
            <Route path="/crop-detection/history" element={<DetectionHistory />} />
            <Route path="/monitoring-alerts" element={<MonitoringAlerts />} />
            <Route path="/satellite-imagery" element={<SatelliteImagery />} />
            <Route path="/reports-analytics" element={<ReportsAnalytics />} />
            <Route path="/district-dashboard" element={<DistrictDashboard />} />
            <Route path="/data-management" element={<DataManagement />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  )
}
