import { primaryCta, site, ui } from '../data/content'

export function MobileActions() {
  return (
    <div className="md:hidden">
      <div aria-hidden="true" className="h-[calc(4rem+env(safe-area-inset-bottom))]" />
      <nav aria-label={ui.contactActionsLabel} className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-line-strong bg-bg/96 pb-[env(safe-area-inset-bottom)] backdrop-blur-[12px]">
        <a href={`tel:+${site.whatsappNumber}`} className="px-4 py-3 text-center font-body text-[0.74rem] font-medium tracking-[0.08em] uppercase no-underline">{ui.call}</a>
        <a href={primaryCta.href} target="_blank" rel="noreferrer" className="bg-accent px-4 py-3 text-center font-body text-[0.74rem] font-medium tracking-[0.08em] text-on-accent uppercase no-underline">{primaryCta.label}</a>
      </nav>
    </div>
  )
}
