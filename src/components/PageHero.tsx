import type { ImageAsset } from '../data/content'
import { primaryCta } from '../data/content'
import { Media } from './Media'

type Props = {
  eyebrow: string
  title: string[]
  body: string
  image?: ImageAsset
  cta?: boolean
}

export function PageHero({ eyebrow, title, body, image, cta = false }: Props) {
  return (
    <section className="relative overflow-hidden border-b border-line" aria-labelledby="page-title">
      <div className={`shell grid ${image ? 'min-h-[calc(100dvh-var(--nav-h))] lg:grid-cols-[1.05fr_0.95fr]' : 'min-h-[62dvh]'} items-stretch`}>
        <div className="relative z-10 grid content-center py-[var(--section-y)] lg:pr-8">
          <p className="eyebrow mb-7">{eyebrow}</p>
          <h1 id="page-title" className="font-display text-hero leading-[0.91] font-medium tracking-[-0.035em] text-balance">
            {title.map((line, index) => (
              <span
                key={line}
                style={{ animationDelay: `${index * 110}ms` }}
                className="block animate-rise last:pb-[0.08em] last:pl-[0.06em] last:leading-[1.08] last:italic last:text-text-dim lg:last:text-[clamp(3rem,4.6vw,4.2rem)] lg:last:whitespace-nowrap"
              >
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-7 max-w-[44ch] text-lead leading-[1.55] text-text-dim">{body}</p>
          {cta && (
            <a href={primaryCta.href} target="_blank" rel="noreferrer" className="button-primary mt-9 w-fit">
              {primaryCta.label}
            </a>
          )}
        </div>
        {image && (
          <Media
            image={image}
            eager
            fill
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="-mx-[var(--gutter)] min-h-[52svh] [&_img]:object-bottom lg:mx-0 lg:min-h-full"
          />
        )}
      </div>
    </section>
  )
}
