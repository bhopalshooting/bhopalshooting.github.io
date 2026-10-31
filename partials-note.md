# Shared markup reference

`index.html`, `coach.html`, `achievements.html` and `contact.html` each carry their own
copy of the utility bar, header, footer and booking form, because the site is plain
static HTML with no build step or templating.

If you edit any of the following, change it in **all four** pages:

| Block | Marker comment |
|---|---|
| Contact utility bar | `<div class="utilitybar">` |
| Header / nav | `<header class="topbar">` |
| CTA band | `<section class="ctaband">` |
| Footer | `<footer class="footer">` |

The booking form lives on `contact.html` only (`id="booking-form"`); other pages link
to `contact.html#book`.

Phone number appears in: utility bar, footer, booking form note, and `js/main.js`
(the WhatsApp handoff number `917869139088`).
