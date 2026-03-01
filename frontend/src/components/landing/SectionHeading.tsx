type SectionHeadingProps = {
  eyebrow?: string
  title: string
  description?: string
  centered?: boolean
}

export const SectionHeading = ({ eyebrow, title, description, centered = true }: SectionHeadingProps) => {
  return (
    <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'}>
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">{eyebrow}</p>
      )}
      <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base text-slate-600 sm:text-lg">{description}</p>}
    </div>
  )
}
