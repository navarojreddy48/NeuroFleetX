import {
  Activity,
  BellRing,
  BrainCircuit,
  Gauge,
  LockKeyhole,
  MapPinned,
  Route,
  ServerCog,
  ShieldAlert,
  Wrench,
} from 'lucide-react'

export const navLinks = [
  { label: 'Features', id: 'features' },
  { label: 'Solutions', id: 'solutions' },
  { label: 'Analytics', id: 'analytics' },
  { label: 'Contact', id: 'contact' },
]

export const trustedLogos = ['MetroMove', 'TransUrban', 'FleetOne', 'LogiCore', 'CityPulse', 'NovaTransit']

export const featureCards = [
  {
    icon: MapPinned,
    title: 'Real-Time Vehicle Tracking',
    description: 'Track every vehicle with low-latency telemetry and location visibility across your city network.',
  },
  {
    icon: Route,
    title: 'Route Optimization',
    description: 'Use AI-driven route suggestions to cut delays, fuel cost, and unnecessary fleet idle time.',
  },
  {
    icon: Gauge,
    title: 'Traffic Congestion Heatmaps',
    description: 'Visualize road density and identify bottlenecks before they affect delivery SLAs.',
  },
  {
    icon: Wrench,
    title: 'Predictive Maintenance',
    description: 'Forecast component wear and schedule maintenance before breakdowns impact operations.',
  },
  {
    icon: BellRing,
    title: 'Smart Alerts & Notifications',
    description: 'Get instant overspeed, route deviation, and anomaly alerts for faster interventions.',
  },
  {
    icon: BrainCircuit,
    title: 'AI-Powered Analytics',
    description: 'Turn fleet telemetry into actionable business decisions with intelligent dashboards.',
  },
]

export const howItWorks = [
  {
    step: '1',
    title: 'Connect Your Fleet',
    description: 'Integrate telemetry devices, APIs, and city traffic feeds in minutes.',
    icon: Activity,
  },
  {
    step: '2',
    title: 'Monitor & Analyze',
    description: 'Observe live fleet movement, alerts, and performance from one control center.',
    icon: Gauge,
  },
  {
    step: '3',
    title: 'Optimize & Automate',
    description: 'Apply AI recommendations to reduce congestion impact and improve productivity.',
    icon: ShieldAlert,
  },
]

export const whyChooseCards = [
  {
    icon: BrainCircuit,
    title: 'AI-Driven Optimization',
    description: 'Continuously optimize routes and dispatch strategy with adaptive machine learning insights.',
  },
  {
    icon: MapPinned,
    title: 'Real-Time Fleet Monitoring',
    description: 'Track every movement, event, and anomaly with live operational visibility across your network.',
  },
  {
    icon: Gauge,
    title: 'Intelligent Traffic Prediction',
    description: 'Anticipate congestion windows and proactively reroute to protect SLA and delivery velocity.',
  },
  {
    icon: ServerCog,
    title: 'Scalable Enterprise Architecture',
    description: 'Designed for city-scale workloads with resilient, high-throughput data and control pipelines.',
  },
  {
    icon: LockKeyhole,
    title: 'Secure & Reliable Infrastructure',
    description: 'Operate with encrypted telemetry, robust access controls, and dependable platform uptime.',
  },
  {
    icon: Activity,
    title: 'Data-Driven Decision Making',
    description: 'Turn mobility data into strategic decisions through clear KPI intelligence and trend analytics.',
  },
]

export const trafficHighlights = [
  'Peak hour prediction',
  'Congestion alerts',
  'AI-based rerouting',
  'Real-time density analysis',
]

export const progressMetrics = [
  { label: 'Peak Hour Accuracy', value: 92 },
  { label: 'Route Optimization Lift', value: 84 },
  { label: 'Congestion Detection Speed', value: 88 },
]

export const demoLineData = [
  { name: 'Mon', value: 40 },
  { name: 'Tue', value: 52 },
  { name: 'Wed', value: 48 },
  { name: 'Thu', value: 68 },
  { name: 'Fri', value: 74 },
  { name: 'Sat', value: 64 },
]

export const demoDonutData = [
  { name: 'Optimized', value: 64 },
  { name: 'In Progress', value: 24 },
  { name: 'Flagged', value: 12 },
]
