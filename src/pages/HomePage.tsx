import { CtaBand } from '../components/CtaBand'
import { DisciplineCarousel } from '../components/DisciplineCarousel'
import { FAQ } from '../components/FAQ'
import { Media, nativeFrame } from '../components/Media'
import { PageHero } from '../components/PageHero'
import { Section } from '../components/Section'
import { SourceLink } from '../components/SourceLink'
import { home, primaryCta } from '../data/content'

const galleryShape = [
  'md:col-span-7 md:aspect-[4/3] lg:aspect-auto',
  'md:col-span-5 md:aspect-[3/4] lg:aspect-auto',
  'md:col-span-5 md:aspect-[3/4] lg:aspect-auto',
  'md:col-span-7 md:aspect-[4/3] lg:aspect-auto',
  'md:col-span-6 md:aspect-[4/5] lg:aspect-auto',
  'md:col-span-6 md:aspect-[4/5] lg:aspect-auto',
]

export function HomePage() {
  return (
    <>
      <PageHero {...home.hero} cta />

      <section aria-label={home.proofLabel} className="border-b border-line">
        <dl className="shell grid grid-cols-2 md:grid-cols-4">
          {home.proof.map((item) => (
            <div key={item.label} className="border-l border-line px-4 py-6 first:border-l-0 md:px-6 md:py-8">
              <dt className="font-display text-title leading-none font-medium tabular-nums">{item.value}</dt>
              <dd className="mt-2 grid gap-2.5 font-body text-[0.7rem] leading-[1.4] tracking-[0.07em] text-text-dim uppercase">
                {item.label}
                {item.source && <SourceLink {...item.source} />}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <Section
        id="disciplines"
        eyebrow={home.disciplines.eyebrow}
        title={home.disciplines.title}
        intro={home.disciplines.intro}
        bleed
      >
        <DisciplineCarousel />
      </Section>

      <Section id="coach" eyebrow={home.coach.eyebrow} title={home.coach.title} tone="panel">
        {/* Splits at lg, not md: at tablet the portrait column shrank to ~300px
            and left a dead band under it. */}
        <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Media image={home.coach.image} className="aspect-[4/5]" sizes="(min-width: 768px) 40vw, 100vw" />
          <div className="grid content-start gap-6">
            <p className="max-w-[52ch] text-lead leading-[1.6]">{home.coach.lead}</p>
            <ul className="grid border-t border-line-strong">
              {home.coach.highlights.map((item) => (
                <li key={item} className="grid grid-cols-[auto_1fr] items-baseline gap-3 border-b border-line py-3.5">
                  <span aria-hidden="true" className="font-body text-body font-semibold text-accent">—</span>
                  <span className="leading-[1.55]">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex flex-wrap gap-3">
              <a href={home.coach.link.href} className="button-secondary">{home.coach.link.label}</a>
              <a href={primaryCta.href} target="_blank" rel="noreferrer" className="button-primary">{primaryCta.label}</a>
            </div>
          </div>
        </div>
      </Section>

      <Section id="shooters" eyebrow={home.athletes.eyebrow} title={home.athletes.title} intro={home.athletes.intro}>
        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {home.athletes.images.map((image) => (
            <Media key={image.src} image={image} className="aspect-[3/2]" sizes="(min-width: 768px) 31vw, 100vw" />
          ))}
        </div>
        <p className="mt-5 font-body text-[0.72rem] tracking-[0.07em] text-text-dim uppercase">{home.athletes.caption}</p>
      </Section>

      <Section
        id="achievements"
        eyebrow={home.achievements.eyebrow}
        title={home.achievements.title}
        intro={home.achievements.intro}
        tone="dark"
      >
        <ul className="grid grid-cols-2 gap-px border border-smoke bg-smoke lg:grid-cols-4">
          {home.achievements.items.map((item) => (
            <li key={item.label} className="grid min-h-48 content-between gap-8 bg-range-black p-5 md:min-h-56 md:p-8">
              <span className="font-display text-h2 leading-none font-medium text-chalk tabular-nums">{item.value}</span>
              <div className="grid gap-2">
                <h3 className="font-display text-title leading-tight font-medium text-chalk">{item.label}</h3>
                <p className="text-body leading-[1.5] text-graphite">{item.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="why" eyebrow={home.difference.eyebrow} title={home.difference.title} tone="dark">
        <ul className="grid gap-px border border-smoke bg-smoke md:grid-cols-2">
          {home.difference.items.map((item, index) => (
            <li key={item.title} className="grid content-start gap-4 bg-range-black p-6 md:min-h-56 md:p-8">
              <span className="eyebrow text-accent">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="font-display text-title leading-[1.15] font-medium text-chalk">{item.title}</h3>
              <p className="max-w-[48ch] leading-[1.65] text-graphite">{item.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="training" eyebrow={home.pathways.eyebrow} title={home.pathways.title}>
        <ol className="grid gap-px border border-line-strong bg-line-strong lg:grid-cols-3">
          {home.pathways.items.map((item) => (
            <li key={item.title} className="grid content-start gap-4 bg-bg p-6 md:p-8 lg:min-h-[20rem]">
              <span className="eyebrow text-accent">{item.number}</span>
              <h3 className="font-display text-title leading-[1.12] font-medium">{item.title}</h3>
              <p className="font-body text-body font-semibold text-text">{item.audience}</p>
              <p className="leading-[1.65] text-text-dim">{item.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="testimonials" eyebrow={home.testimonials.eyebrow} title={home.testimonials.title} tone="panel">
        <ul className="grid gap-px border border-line-strong bg-line-strong lg:grid-cols-3">
          {home.testimonials.items.map((item, index) => (
            <li key={`${item.name}-${index}`} className="bg-bg p-6 md:p-8">
              <blockquote className="flex h-full min-h-64 flex-col justify-between gap-10">
                <p className="font-display text-title leading-[1.45]">“{item.quote}”</p>
                <footer className="border-t border-line pt-5">
                  <cite className="font-body text-body font-semibold not-italic">{item.name}</cite>
                  <p className="mt-1 text-body text-text-dim">{item.detail}</p>
                </footer>
              </blockquote>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="gallery" eyebrow={home.gallery.eyebrow} title={home.gallery.title} tone="panel">
        <div className="grid gap-4 md:grid-cols-12 md:gap-6">
          {home.gallery.images.map((image, index) => (
            <Media
              key={`${image.src}-${index}`}
              image={image}
              className={`${nativeFrame(image)} ${galleryShape[index]}`}
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          ))}
        </div>
      </Section>

      <Section id="faq" eyebrow={home.faq.eyebrow} title={home.faq.title}>
        <FAQ items={home.faq.items} />
      </Section>

      <CtaBand {...home.closing} />
    </>
  )
}
