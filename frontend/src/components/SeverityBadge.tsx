type Severity = 'CRITICAL' | 'MEDIUM' | 'NORMAL'

const severityStyles: Record<Severity, string> = {
  CRITICAL: 'bg-red-500/20 text-red-300 border-red-400/40',
  MEDIUM: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
  NORMAL: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
}

export const SeverityBadge = ({ severity }: { severity: Severity }) => {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${severityStyles[severity]}`}
    >
      {severity}
    </span>
  )
}
