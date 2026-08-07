import { ContactForm } from '../components/ContactForm'
import { Section } from '../components/Section'
import { contact } from '../data/content'

export function ContactPage() {
  return (
    <>
      <section className="border-b border-line py-[var(--section-y)]" aria-labelledby="page-title">
        <div className="shell grid gap-6">
          <p className="eyebrow">{contact.hero.eyebrow}</p>
          <h1 id="page-title" className="font-display text-hero leading-[0.92] font-medium tracking-[-0.035em]">
            {contact.hero.title.map((line) => <span key={line} className="block last:italic last:text-text-dim">{line}</span>)}
          </h1>
          <p className="max-w-[48ch] text-lead leading-[1.55] text-text-dim">{contact.hero.body}</p>
        </div>
      </section>

      <Section id="book" compact>
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <ContactForm />
          <div className="grid gap-10">
            <header className="grid gap-3">
              <p className="eyebrow">{contact.details.eyebrow}</p>
              <h2 className="font-display text-h2 leading-[1.05] font-medium">{contact.details.title}</h2>
            </header>
            <ul className="border-t border-line-strong">
              {contact.details.channels.map((channel) => (
                <li key={channel.label} className="grid gap-1 border-b border-line py-4">
                  <span className="eyebrow">{channel.label}</span>
                  {/* Body face, not display: Bodoni's plus is a hairline that
                      all but vanishes, so the number read as a local one. */}
                  <a href={channel.href} target={channel.external ? '_blank' : undefined} rel={channel.external ? 'noreferrer' : undefined} className="w-fit font-body text-title font-medium no-underline hover:text-accent">{channel.value}</a>
                </li>
              ))}
            </ul>
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <p className="eyebrow mb-3">{contact.details.addressLabel}</p>
                <address className="grid gap-1 not-italic text-text-dim">
                  {contact.details.address.map((line) => <span key={line}>{line}</span>)}
                </address>
                <a href={contact.details.directions} target="_blank" rel="noreferrer" className="text-link mt-4 inline-flex">{contact.details.directionsLabel}</a>
              </div>
              <div>
                <p className="eyebrow mb-3">{contact.details.hoursLabel}</p>
                <p className="text-text-dim">{contact.details.hours}</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="what-next" eyebrow={contact.expectation.eyebrow} title={contact.expectation.title} tone="dark">
        <ol className="grid gap-px border border-smoke bg-smoke md:grid-cols-3">
          {contact.expectation.items.map((item, index) => (
            <li key={item.title} className="grid content-start gap-4 bg-range-black p-6 md:min-h-64 md:p-8">
              <span className="eyebrow text-accent">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="font-display text-title leading-[1.15] font-medium text-chalk">{item.title}</h3>
              <p className="leading-[1.65] text-graphite">{item.body}</p>
            </li>
          ))}
        </ol>
      </Section>
    </>
  )
}
