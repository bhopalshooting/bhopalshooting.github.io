import { CtaBand } from '../components/CtaBand'
import { Media } from '../components/Media'
import { PageHero } from '../components/PageHero'
import { Section } from '../components/Section'
import { about } from '../data/content'

export function AboutPage() {
  return (
    <>
      <PageHero {...about.hero} />

      <Section id="purpose" eyebrow={about.story.eyebrow} title={about.story.title}>
        <div className="grid max-w-[64ch] gap-6 text-lead leading-[1.65]">
          {about.story.body.map((paragraph) => <p key={paragraph.slice(0, 32)}>{paragraph}</p>)}
        </div>
      </Section>

      <Section id="standards" eyebrow={about.values.eyebrow} title={about.values.title} tone="panel">
        <ul className="grid gap-px border border-line-strong bg-line-strong md:grid-cols-3">
          {about.values.items.map((item, index) => (
            <li key={item.title} className="grid content-start gap-4 bg-bg p-6 md:min-h-64 md:p-8">
              <span className="eyebrow text-accent">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="font-display text-title leading-[1.15] font-medium">{item.title}</h3>
              <p className="leading-[1.65] text-text-dim">{item.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="coach" eyebrow={about.coach.eyebrow} title={about.coach.title} tone="dark">
        {/* Button takes its own track so the row reaches the shell edge; with
            image + text alone the copy ran out and left a third of the band empty. */}
        <div className="grid items-center gap-8 lg:grid-cols-[0.4fr_1fr_auto] lg:gap-12">
          <Media image={about.coach.image} className="aspect-[4/5] lg:aspect-square" sizes="(min-width: 1024px) 26vw, 100vw" />
          <p className="max-w-[46ch] text-lead leading-[1.62] text-graphite">{about.coach.body}</p>
          <a href={about.coach.link.href} className="button-light w-fit">{about.coach.link.label}</a>
        </div>
      </Section>

      <Section id="visit" eyebrow={about.visit.eyebrow} title={about.visit.title}>
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <p className="eyebrow mb-4">{about.visit.addressLabel}</p>
            <address className="grid gap-1 text-lead leading-[1.6] not-italic text-text-dim">
              {about.visit.address.map((line) => <span key={line}>{line}</span>)}
            </address>
            <a href={about.visit.link.href} target="_blank" rel="noreferrer" className="text-link mt-6">{about.visit.link.label}</a>
          </div>
          <div>
            <p className="eyebrow mb-4">{about.visit.hoursLabel}</p>
            <p className="text-lead leading-[1.6] text-text-dim">{about.visit.hours}</p>
            <div className="mt-8">
              <p className="eyebrow mb-2">{about.ownership.eyebrow}</p>
              <p className="leading-[1.6] text-text-dim">{about.ownership.text}</p>
            </div>
          </div>
        </div>
      </Section>

      <CtaBand {...about.closing} />
    </>
  )
}
