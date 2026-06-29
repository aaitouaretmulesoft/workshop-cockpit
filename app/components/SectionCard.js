export default function SectionCard({ eyebrow, title, action, children, tone = 'tint' }) {
  const wrapper =
    tone === 'tint'
      ? 'bg-cloud-95/70 border border-cloud-80/60'
      : 'bg-white border border-cloud-80/60';

  return (
    <section className={`rounded-card ${wrapper} p-5 sm:p-6`}>
      {(eyebrow || title || action) && (
        <header className="mb-4 flex items-center justify-between gap-4">
          <div>
            {eyebrow ? (
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cloud-40">
                {eyebrow}
              </div>
            ) : null}
            {title ? (
              <h2 className="mt-1 font-display text-lg font-medium text-electric-15">
                {title}
              </h2>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </header>
      )}
      {children}
    </section>
  );
}
