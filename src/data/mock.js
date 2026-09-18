export const stats = [
  {
    label: 'Total Cropped Area',
    value: '22.45',
    unit: 'M ha',
    trend: '5.6% vs last season',
    trendUp: true,
    icon: 'sprout',
  },
  {
    label: 'Detected Crops',
    value: '15',
    unit: '',
    trend: 'Major Crop Types',
    trendUp: null,
    icon: 'leaf',
  },
  {
    label: 'Districts Covered',
    value: '154',
    unit: '/ 154',
    trend: '100% Coverage',
    trendUp: null,
    icon: 'map-pin',
  },
  {
    label: 'Alerts Generated',
    value: '28',
    unit: '',
    trend: 'Active Alerts',
    trendUp: null,
    icon: 'alert-triangle',
  },
  {
    label: 'Reports Generated',
    value: '96',
    unit: '',
    trend: 'This Season',
    trendUp: null,
    icon: 'file-text',
  },
]

export const trendData = [
  { month: 'May', current: 5, last: 4 },
  { month: 'Jun', current: 10.5, last: 7 },
  { month: 'Jul', current: 13.5, last: 10.5 },
  { month: 'Aug', current: 18, last: 14.5 },
  { month: 'Sep', current: 21, last: 18.5 },
  { month: 'Oct', current: 22, last: 20.5 },
]

export const legend = [
  { label: 'Rice', color: '#1a7a34' },
  { label: 'Maize', color: '#2f9e44' },
  { label: 'Cotton', color: '#e6c419' },
  { label: 'Sugarcane', color: '#e8912b' },
  { label: 'Wheat', color: '#d1442f' },
  { label: 'Other Crops', color: '#8a8a8a' },
  { label: 'No Crop', color: '#d9d9d9' },
]

export const alerts = [
  {
    title: 'Low Vegetation Health Detected',
    district: 'District: Dera Ghazi Khan, Punjab',
    date: '20 May 2024',
    severity: 'Medium',
  },
  {
    title: 'Possible Crop Stress Detected',
    district: 'District: Sanghar, Sindh',
    date: '19 May 2024',
    severity: 'High',
  },
  {
    title: 'Abnormal NDVI Change',
    district: 'District: Rajanpur, Punjab',
    date: '18 May 2024',
    severity: 'Medium',
  },
]

export const cropCalendar = [
  { label: 'Sowing', range: 'May - Jun', status: 'done' },
  { label: 'Growing', range: 'Jun - Aug', status: 'done' },
  { label: 'Flowering', range: 'Aug - Sep', status: 'active' },
  { label: 'Harvesting', range: 'Sep - Oct', status: 'upcoming' },
]

export const announcement = {
  title: 'Training Workshop on Crop Monitoring using Remote Sensing',
  body: 'NDMA is organizing a training for provincial & district officers.',
  date: '25 May 2024',
  location: 'NDMA HQ, Islamabad',
}

export const navItems = [
  { label: 'Dashboard', icon: 'layout-dashboard' },
  { label: 'Crop Overview', icon: 'table' },
  { label: 'Crop Detection', icon: 'crosshair', hasChildren: true },
  { label: 'Monitoring & Alerts', icon: 'bell' },
  { label: 'Satellite Imagery', icon: 'satellite' },
  { label: 'Reports & Analytics', icon: 'bar-chart-2' },
  { label: 'District Dashboard', icon: 'layout-grid' },
  { label: 'Data Management', icon: 'database' },
  { label: 'User Management', icon: 'users' },
  { label: 'Settings', icon: 'settings' },
]

export const quickActions = [
  { label: 'Run New\nCrop Detection', icon: 'crosshair' },
  { label: 'View Satellite\nImagery', icon: 'satellite' },
  { label: 'Generate\nReport', icon: 'file-text' },
  { label: 'Download\nData', icon: 'download' },
  { label: 'Advance\nAnalytics', icon: 'trending-up' },
]
