# Production TODO

Pending work in this repository. Nothing is complete until it has been verified.

## Blocked on the client

Content we cannot write or correct until the client supplies it.

- [ ] Student achievement figures: medals, highest score with event/category, state qualifiers, national appearances.
- [ ] Testimonial quotes with names and attributions, or approval to anonymise.
- [ ] Photos for 25m Standard Pistol, 25m Sports Pistol and 25m Rapid Fire Pistol.
- [ ] Is 50m Rifle 3 Positions coached? The carousel advertises it; the booking form and structured data do not.
- [ ] Documents, or corrected wording, for three credential claims:
  - ISSF A, B, C and D licences — published evidence supports D and attendance at a B course.
  - NRAI Grade A — the document is a participation certificate and states no grade.
  - MPSRA Grade A — nothing published.
- [ ] Sign-off on factual and promotional claims: “Bhopal's best,” opening hours, ownership, competition history, squad-trial status, small training groups.
- [ ] Permission to publish every identifiable student photo, especially of minors, and all certificate scans.
- [ ] The Justdial figure: keep a changing total, or show the rating only? The site says 885 reviews; the audit found 936.
- [ ] Privacy wording for enquiries carrying names, ages, goals and child-related information.

## Changes to make once it lands

- [ ] Replace the mock achievement values, placeholder copy, lorem ipsum testimonials and placeholder names.
- [ ] Install the three carousel photos, then drop their `standIn` flags and the temporary-photo note in `src/data/content.ts`.
- [ ] Apply the credential and factual corrections across content, metadata and structured data.
- [ ] Reconcile rifle offerings across the carousel, booking form, FAQ, metadata and structured data.
- [ ] Update or remove the Justdial count.
- [ ] Add the privacy notice near the WhatsApp enquiry form.

## Verify before shipping

- [ ] No placeholder, lorem ipsum, `XX`/`XXX` or `standIn` content remains.
- [ ] Every page at mobile, tablet and desktop widths, in both themes.
- [ ] Navigation, carousel controls, contact form, WhatsApp, telephone, maps, social and credential links.
