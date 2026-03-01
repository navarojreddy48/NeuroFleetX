import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { MotionCard } from '../../ui/MotionCard'

type WeeklyTrip = {
  day: string
  trips: number
}

type VehicleUsage = {
  name: string
  value: number
}

type FleetDashboardChartsProps = {
  weeklyTrips: WeeklyTrip[]
  vehicleUsageData: VehicleUsage[]
  pieColors: string[]
}

export default function FleetDashboardCharts({
  weeklyTrips,
  vehicleUsageData,
  pieColors,
}: FleetDashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <MotionCard className="xl:col-span-2" hover={false}>
        <h3 className="mb-4 text-lg font-semibold">Weekly Trips</h3>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyTrips}>
              <XAxis dataKey="day" stroke="#a1a1aa" />
              <YAxis stroke="#a1a1aa" />
              <Tooltip />
              <Line type="monotone" dataKey="trips" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </MotionCard>

      <MotionCard hover={false}>
        <h3 className="mb-4 text-lg font-semibold">Vehicle Usage</h3>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={vehicleUsageData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
              >
                {vehicleUsageData.map((entry, index) => (
                  <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </MotionCard>
    </div>
  )
}