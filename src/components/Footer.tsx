import { footer, navigation, primaryCta, site, ui } from '../data/content'

export function Footer() {
  return (
    <footer className="border-t border-line bg-range-black py-[var(--section-y)] text-chalk">
      <div className="shell grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid content-between gap-10">
          <div className="grid gap-4">
            <a href="/" className="block w-fit no-underline" aria-label={ui.homeLabel}>
              <img src="/icons/logo-mark-light.png" alt="" width={640} height={184} loading="lazy" decoding="async" className="h-16 w-auto" />
            </a>
            <p className="max-w-[42ch] text-lead leading-[1.55] text-graphite">{footer.statement}</p>
          </div>
          <p className="font-body text-[0.72rem] tracking-[0.08em] text-graphite uppercase">{footer.legal}</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <nav aria-label={ui.footerNavigationLabel}>
            <p className="eyebrow mb-4 !text-graphite">{footer.exploreLabel}</p>
            {/* Padding rather than gap: the links were 22px tall, well under a
                comfortable thumb, and the list pitch stays about the same. */}
            <ul className="grid gap-0.5">
              {navigation.map((item) => (
                <li key={item.href}><a href={item.href} className="inline-block py-2 text-body text-chalk no-underline hover:text-accent">{item.label}</a></li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="eyebrow mb-4 !text-graphite">{footer.startLabel}</p>
            <a href={primaryCta.href} target="_blank" rel="noreferrer" className="button-primary">{primaryCta.label}</a>
            <p className="mt-5 text-body text-graphite">{site.phoneDisplay}<br />{site.locationShort}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
