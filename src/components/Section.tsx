import type { ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'

type Props = {
  id?: string
  eyebrow?: string
  title?: string
  intro?: string
  tone?: 'default' | 'panel' | 'dark'
  bleed?: boolean
  compact?: boolean
  children: ReactNode
}

export function Section({
  id,
  eyebrow,
  title,
  intro,
  tone = 'default',
  bleed = false,
  compact = false,
  children,
}: Props) {
  const { ref, shown, canAnimate } = useReveal<HTMLDivElement>()
  const titleId = id && title ? `${id}-title` : undefined
  const toneClass =
    tone === 'panel' ? 'bg-surface' : tone === 'dark' ? 'bg-range-black text-chalk' : ''

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={`${compact ? 'py-[calc(var(--section-y)*0.72)]' : 'py-[var(--section-y)]'} ${toneClass}`}
    >
      <div
        ref={ref}
        className={`transition-[opacity,transform] duration-[640ms] ease-spring motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
          !canAnimate || shown ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
        }`}
      >
        {(eyebrow || title || intro) && (
          <header className="shell mb-[calc(var(--section-y)*0.55)] grid gap-4 md:grid-cols-[0.55fr_1.45fr] md:gap-x-10 lg:gap-x-20">
            {eyebrow && <p className="eyebrow md:pt-2">{eyebrow}</p>}
            <div className={`grid max-w-[68ch] gap-4 ${eyebrow ? 'md:col-start-2' : ''}`}>
              {title && (
                <h2 id={titleId} className="font-display text-h2 leading-[1.04] font-medium tracking-[-0.02em] text-balance">
                  {title}
                </h2>
              )}
              {intro && <p className="max-w-[62ch] text-lead leading-[1.55] text-text-dim">{intro}</p>}
            </div>
          </header>
        )}
        {bleed ? children : <div className="shell">{children}</div>}
      </div>
    </section>
  )
}
