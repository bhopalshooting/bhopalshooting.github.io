import { notFound, primaryCta } from '../data/content'

export function NotFoundPage() {
  return (
    <section className="grid min-h-[65dvh] place-items-center py-[var(--section-y)]">
      <div className="shell grid max-w-3xl gap-6 text-center">
        <p className="eyebrow justify-self-center">{notFound.eyebrow}</p>
        <h1 className="font-display text-hero leading-[0.95] font-medium">{notFound.title}</h1>
        <p className="text-lead text-text-dim">{notFound.body}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-3">
          <a href={notFound.link.href} className="button-secondary">{notFound.link.label}</a>
          <a href={primaryCta.href} target="_blank" rel="noreferrer" className="button-primary">{primaryCta.label}</a>
        </div>
      </div>
    </section>
  )
}
