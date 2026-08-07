import { primaryCta } from '../data/content'

type Props = {
  eyebrow: string
  title: string
  body: string
}

export function CtaBand({ eyebrow, title, body }: Props) {
  return (
    <section className="bg-accent py-[var(--section-y)] text-on-accent">
      <div className="shell grid items-end gap-8 md:grid-cols-[1.3fr_0.7fr] md:gap-12">
        <div className="grid gap-4">
          <p className="eyebrow !text-on-accent/70">{eyebrow}</p>
          <h2 className="max-w-[18ch] font-display text-h2 leading-[1.04] font-medium tracking-[-0.02em] text-balance">{title}</h2>
          <p className="max-w-[55ch] text-lead leading-[1.55] text-on-accent/78">{body}</p>
        </div>
        <a
          href={primaryCta.href}
          target="_blank"
          rel="noreferrer"
          className="button-dark w-full justify-center md:w-fit md:justify-self-end"
        >
          {primaryCta.label}
        </a>
      </div>
    </section>
  )
}
