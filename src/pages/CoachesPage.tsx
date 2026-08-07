import { CtaBand } from '../components/CtaBand'
import { Media } from '../components/Media'
import { PageHero } from '../components/PageHero'
import { Section } from '../components/Section'
import { coaches } from '../data/content'

export function CoachesPage() {
  return (
    <>
      <PageHero {...coaches.hero} cta />

      <Section id="rishi-soni" eyebrow={coaches.intro.eyebrow} title={coaches.intro.title}>
        <div className="grid items-start gap-8 md:grid-cols-[1.1fr_0.9fr] md:gap-12 lg:gap-16">
          <ul className="grid border-t border-line-strong">
            {coaches.intro.highlights.map((item) => (
              <li key={item} className="grid grid-cols-[auto_1fr] items-baseline gap-3 border-b border-line py-4">
                <span aria-hidden="true" className="font-body text-body font-semibold text-accent">—</span>
                <span className="text-lead leading-[1.5]">{item}</span>
              </li>
            ))}
          </ul>
          <Media image={coaches.intro.image} className="aspect-[4/5]" sizes="(min-width: 768px) 40vw, 100vw" />
        </div>
      </Section>

      <Section id="record" eyebrow={coaches.record.eyebrow} title={coaches.record.title} tone="panel">
        <ol className="border-t border-line-strong">
          {coaches.record.items.map((item) => (
            <li key={item.year} className="grid gap-3 border-b border-line py-5 md:grid-cols-[9rem_1fr] md:items-baseline md:py-7">
              <span className="font-display text-title font-medium tabular-nums">{item.year}</span>
              <p className="max-w-[62ch] text-lead leading-[1.55] text-text-dim">{item.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-5 font-body text-[0.72rem] tracking-[0.07em] text-text-dim uppercase">{coaches.record.sourceLabel}</p>
      </Section>

      <Section id="method" eyebrow={coaches.method.eyebrow} title={coaches.method.title} tone="dark">
        <ol className="grid gap-px border border-smoke bg-smoke md:grid-cols-3">
          {coaches.method.items.map((item) => (
            <li key={item.title} className="grid content-start gap-4 bg-range-black p-6 md:min-h-64 md:p-8">
              <span className="eyebrow text-accent">{item.number}</span>
              <h3 className="font-display text-title leading-[1.15] font-medium text-chalk">{item.title}</h3>
              <p className="leading-[1.65] text-graphite">{item.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="credentials" eyebrow={coaches.credentials.eyebrow} title={coaches.credentials.title}>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {coaches.credentials.documents.map((document) => (
            <li key={document.title} className="grid content-start gap-4">
              <a
                href={document.href}
                target="_blank"
                rel="noreferrer"
                className="block border border-line-strong no-underline transition-colors hover:border-text"
              >
                <Media
                  image={document.image}
                  className="aspect-[1.414/1]"
                  contain
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                />
              </a>
              <div className="grid gap-1.5">
                <h3 className="font-display text-title leading-[1.2] font-medium">{document.title}</h3>
                <p className="font-body text-[0.72rem] tracking-[0.07em] text-text-dim uppercase">{document.issuer}</p>
                <p className="leading-[1.55] text-text-dim">{document.detail}</p>
                <a href={document.href} target="_blank" rel="noreferrer" className="text-link mt-1 w-fit">{document.hrefLabel}</a>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-[calc(var(--section-y)*0.5)] mb-6 max-w-[62ch] text-lead leading-[1.55] text-text-dim">
          {coaches.credentials.gallery.intro}
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {coaches.credentials.gallery.images.map((image) => (
            <Media key={image.src} image={image} className="aspect-[3/2]" sizes="(min-width: 768px) 46vw, 100vw" />
          ))}
        </div>
      </Section>

      <CtaBand {...coaches.closing} />
    </>
  )
}
