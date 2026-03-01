function DriverStatCard({ label, value, tone = 'neutral' }) {
  const toneClassMap = {
    neutral: 'border-slate-200 bg-white',
    green: 'border-emerald-200 bg-emerald-50',
    lightGreen: 'border-green-200 bg-green-50',
  }

  return (
    <article className={`rounded-xl border p-4 shadow-sm ${toneClassMap[tone] || toneClassMap.neutral}`}>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </article>
  )
}

export default DriverStatCard
