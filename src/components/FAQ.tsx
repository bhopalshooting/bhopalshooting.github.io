type Item = { question: string; answer: string }

export function FAQ({ items }: { items: Item[] }) {
  return (
    <div className="border-t border-line-strong">
      {items.map((item) => (
        <details key={item.question} className="group border-b border-line py-5 md:py-6">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-8 font-display text-title leading-[1.25] font-medium marker:content-none">
            {item.question}
            <span aria-hidden="true" className="mt-1 font-body text-body text-accent transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-4 max-w-[68ch] pr-10 leading-[1.65] text-text-dim">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
