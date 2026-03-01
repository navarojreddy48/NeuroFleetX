import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts'

type HeroPoint = {
  value: number
}

type LandingHeroChartProps = {
  data: HeroPoint[]
}

export default function LandingHeroChart({ data }: LandingHeroChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}