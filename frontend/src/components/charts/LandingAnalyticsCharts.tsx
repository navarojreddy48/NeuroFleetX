import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer } from 'recharts'

type LinePoint = {
  value: number
}

type DonutPoint = {
  name: string
  value: number
}

type LandingAnalyticsChartsProps = {
  lineData: LinePoint[]
  donutData: DonutPoint[]
  donutColors: string[]
}

export default function LandingAnalyticsCharts({
  lineData,
  donutData,
  donutColors,
}: LandingAnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="h-44 rounded-2xl border border-white/10 bg-slate-900/40 p-4">
        <p className="mb-2 text-xs text-slate-300">Weekly Route Efficiency</p>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={lineData}>
            <Line type="monotone" dataKey="value" stroke="#34d399" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="h-44 rounded-2xl border border-white/10 bg-slate-900/40 p-4">
        <p className="mb-2 text-xs text-slate-300">Fleet Health Mix</p>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie data={donutData} dataKey="value" innerRadius={32} outerRadius={52}>
              {donutData.map((entry, index) => (
                <Cell key={entry.name} fill={donutColors[index % donutColors.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}