import { useEffect, useRef, useState } from 'react'
import { navigation, primaryCta, ui } from '../data/content'
import { useTheme } from '../hooks/useTheme'

type Props = { pathname: string }

export function Nav({ pathname }: Props) {
  const [open, setOpen] = useState(false)
  const [stuck, setStuck] = useState(false)
  const sentinel = useRef<HTMLDivElement>(null)
  const header = useRef<HTMLElement>(null)
  const { theme, toggle } = useTheme()

  useEffect(() => {
    const node = sentinel.current
    if (!node || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting))
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    const closeOutside = (event: PointerEvent | FocusEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('focusin', closeOutside)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('focusin', closeOutside)
    }
  }, [open])

  return (
    <>
      <div ref={sentinel} aria-hidden="true" className="pointer-events-none absolute top-0 h-px w-full" />
      <header
        ref={header}
        className={`sticky top-0 z-50 border-b backdrop-blur-[12px] transition-colors duration-200 ease-spring ${
          stuck ? 'border-line bg-bg/96' : 'border-transparent bg-bg/88'
        }`}
      >
        <div className="shell flex min-h-[var(--nav-h)] items-center justify-between gap-4 py-3">
          <a href="/" className="min-w-0 no-underline" aria-label={ui.homeLabel}>
            <img
              src="/icons/logo-mark-light.png"
              alt=""
              width={640}
              height={184}
              className={`h-11 w-auto sm:h-12 ${theme === 'light' ? 'brightness-0' : ''}`}
            />
          </a>

          {/* Below lg the menu drops out of flow as an overlay. Wrapping it onto
              a second header row instead made the bar 118px tall on a phone,
              because flex wraps items before it shrinks them. */}
          <nav
            id="site-menu"
            aria-label={ui.mainNavigationLabel}
            className={`absolute inset-x-0 top-full border-b border-line bg-bg lg:static lg:block lg:border-0 lg:bg-transparent ${open ? 'block' : 'hidden'}`}
          >
            <ul className="flex flex-col gap-3 px-[var(--gutter)] py-4 lg:flex-row lg:gap-5 lg:px-0 lg:py-0 xl:gap-7">
              {navigation.map((item) => {
                const current = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={current ? 'page' : undefined}
                      onClick={() => setOpen(false)}
                      className="border-b border-transparent py-1.5 font-body text-[0.74rem] font-medium tracking-[0.08em] text-text-dim uppercase no-underline transition-colors hover:text-text aria-[current=page]:border-accent aria-[current=page]:text-text"
                    >
                      {item.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <a href={primaryCta.href} target="_blank" rel="noreferrer" className="button-primary hidden !px-4 !py-2.5 sm:inline-flex">
              {primaryCta.label}
            </a>
            <button
              type="button"
              onClick={toggle}
              aria-label={theme === 'light' ? ui.switchToDark : ui.switchToLight}
              className="grid size-10 cursor-pointer place-items-center border border-line-strong bg-transparent text-text transition-colors hover:border-text hover:bg-text/6"
            >
              {theme === 'light' ? (
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[1.1rem] fill-none stroke-current [stroke-linecap:round] [stroke-width:1.7]">
                  <circle cx="12" cy="12" r="3.25" />
                  <path d="M12 2.75v2M12 19.25v2M2.75 12h2M19.25 12h2M5.46 5.46l1.42 1.42M17.12 17.12l1.42 1.42M18.54 5.46l-1.42 1.42M6.88 17.12l-1.42 1.42" />
                </svg>
              ) : (
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[1.1rem] fill-none stroke-current [stroke-linecap:round] [stroke-width:1.7]">
                  <path d="M19.35 15.35A8 8 0 0 1 8.65 4.65a8 8 0 1 0 10.7 10.7Z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((value) => !value)}
              className="min-h-10 cursor-pointer border border-line-strong bg-transparent px-3 font-body text-[0.72rem] tracking-[0.08em] uppercase lg:hidden"
            >
              {open ? ui.menuClose : ui.menuOpen}
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
