type Props = { href: string; label: string }

/** A quiet link out to the public record behind a claim. */
export function SourceLink({ href, label }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="eyebrow inline-flex w-fit items-baseline gap-1.5 underline decoration-line-strong decoration-1 underline-offset-[0.4em] transition-colors hover:text-text hover:decoration-accent"
    >
      {label}
      <span aria-hidden="true">↗</span>
    </a>
  )
}
