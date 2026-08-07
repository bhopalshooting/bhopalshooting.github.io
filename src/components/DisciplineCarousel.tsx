import { useCallback, useEffect, useRef, useState } from 'react'
import { disciplines, ui } from '../data/content'
import { Media } from './Media'

const arrowClass =
  'pointer-events-auto hidden size-11 cursor-pointer place-items-center border border-line-strong bg-bg/92 text-text backdrop-blur-[6px] transition-colors hover:border-text hover:bg-text/6 disabled:cursor-default disabled:opacity-30 disabled:hover:border-line-strong disabled:hover:bg-bg/92 md:grid'

export function DisciplineCarousel() {
  const scroller = useRef<HTMLDivElement>(null)
  // False until the client measures an overflow, so arrows never show on a row
  // with nowhere to scroll.
  const [scrollable, setScrollable] = useState(false)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const sync = useCallback(() => {
    const node = scroller.current
    if (!node) return
    const max = node.scrollWidth - node.clientWidth
    setScrollable(max > 1)
    setAtStart(node.scrollLeft <= 1)
    setAtEnd(node.scrollLeft >= max - 1)
  }, [])

  useEffect(() => {
    const node = scroller.current
    if (!node) return
    sync()
    const observer = new ResizeObserver(sync)
    observer.observe(node)
    return () => observer.disconnect()
  }, [sync])

  const page = (direction: -1 | 1) => {
    const node = scroller.current
    if (!node) return
    const items = node.querySelectorAll('li')
    // Adjacent offsets carry card width plus the current gap, so a page lands on
    // a snap point at every breakpoint without hardcoding either.
    const step =
      items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : node.clientWidth * 0.8
    node.scrollBy({
      left: direction * step,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  return (
    <div className="relative">
      <div
        ref={scroller}
        onScroll={sync}
        // A plain overflow container is not keyboard-reachable; this makes the
        // track focusable and arrow-key scrollable.
        tabIndex={0}
        role="group"
        aria-label={ui.disciplinesLabel}
        aria-describedby={scrollable ? 'disciplines-hint' : undefined}
        className="snap-x snap-mandatory touch-pan-x overflow-x-auto overscroll-x-contain scroll-smooth"
      >
        <ul className="flex w-max gap-4 px-[var(--gutter)] pb-3 md:gap-6">
          {disciplines.map((item) => (
            <li
              key={item.code}
              className="w-[16rem] shrink-0 snap-start md:w-[21rem]"
            >
              <Media image={item.image} className="aspect-[4/5]" sizes="(min-width: 768px) 21rem, 16rem" />
              <div className="mt-4 grid gap-1.5">
                <span className="eyebrow text-accent">{item.code}</span>
                <h3 className="font-display text-title leading-[1.15] font-medium">{item.name}</h3>
                <p className="text-text-dim">{item.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-[var(--gutter)] bg-gradient-to-r from-bg to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-[var(--gutter)] bg-gradient-to-l from-bg to-transparent" />
      {scrollable && (
        <>
          <p id="disciplines-hint" className="sr-only">{ui.disciplinesHint}</p>
          {/* Centred on the image (21rem at 4:5), not the container, which is
              taller by its caption. */}
          <div className="pointer-events-none absolute inset-x-[var(--gutter)] top-[13.1rem] flex -translate-y-1/2 justify-between">
            <button
              type="button"
              onClick={() => page(-1)}
              disabled={atStart}
              aria-label={ui.disciplinesPrevious}
              className={arrowClass}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[1.1rem] fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.7]">
                <path d="M14.5 5 8 12l6.5 7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => page(1)}
              disabled={atEnd}
              aria-label={ui.disciplinesNext}
              className={arrowClass}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[1.1rem] fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.7]">
                <path d="M9.5 5 16 12l-6.5 7" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
