import type { FormEvent } from 'react'
import { contact, site } from '../data/content'

const labelClass = 'font-body text-[0.72rem] font-medium tracking-[0.09em] uppercase text-text-dim'
// min-w-0: inputs carry an intrinsic width (~219px) that otherwise refuses to
// shrink into a narrower grid track, so the two-up row overlapped itself.
const controlClass = 'min-h-12 w-full min-w-0 border border-line-strong bg-bg px-3.5 font-body text-body text-text outline-none transition-colors focus:border-accent'

export function ContactForm() {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const message = [
      contact.form.messageIntro,
      `${contact.form.messageLabels.name}: ${data.get('name')}`,
      `${contact.form.messageLabels.age}: ${data.get('age')}`,
      `${contact.form.messageLabels.discipline}: ${data.get('discipline')}`,
      `${contact.form.messageLabels.level}: ${data.get('level')}`,
      `${contact.form.messageLabels.goal}: ${data.get('goal')}`,
    ].join('\n')
    window.location.assign(`https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`)
  }

  return (
    <form onSubmit={submit} className="grid gap-5 border border-line-strong bg-surface p-6 md:p-8">
      <div className="grid gap-2">
        <h2 className="font-display text-title leading-[1.15] font-medium">{contact.form.title}</h2>
        <p className="text-text-dim">{contact.form.intro}</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className={labelClass}>{contact.form.fields.name}</span>
          <input required name="name" autoComplete="name" className={controlClass} />
        </label>
        <label className="grid gap-2">
          <span className={labelClass}>{contact.form.fields.age}</span>
          <input required name="age" inputMode="numeric" className={controlClass} />
        </label>
      </div>
      <label className="grid gap-2">
        <span className={labelClass}>{contact.form.fields.discipline}</span>
        <select required name="discipline" defaultValue="" className={controlClass}>
          <option value="" disabled>{contact.form.selectPlaceholder}</option>
          {contact.form.disciplines.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
      <label className="grid gap-2">
        <span className={labelClass}>{contact.form.fields.level}</span>
        <select required name="level" defaultValue="" className={controlClass}>
          <option value="" disabled>{contact.form.selectPlaceholder}</option>
          {contact.form.levels.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
      <label className="grid gap-2">
        <span className={labelClass}>{contact.form.fields.goal}</span>
        <textarea required name="goal" rows={4} className={`${controlClass} py-3`} />
      </label>
      <button type="submit" className="button-primary mt-1 cursor-pointer justify-center">{contact.form.submit}</button>
    </form>
  )
}
