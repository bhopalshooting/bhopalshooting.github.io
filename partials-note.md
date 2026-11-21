# Shared markup reference

`index.html`, `coach.html`, `achievements.html`, `contact.html` and `nscc.html` each carry their own
copy of the utility bar, header, footer and booking form, because the site is plain
static HTML with no build step or templating.

If you edit any of the following, change it in **all five** pages:

| Block | Marker comment |
|---|---|
| Contact utility bar | `<div class="utilitybar">` |
| Header / nav | `<header class="topbar">` |
| CTA band | `<section class="ctaband">` |
| Footer | `<footer class="footer">` |

Every **Book a Session** button (nav, hero, footer, CTAs) goes to the NSCC slot booking
at `nscc.html#slots`. The general enquiry form still lives on `contact.html`
(`id="booking-form"`, anchor `#book`) and is reached from the Contact page.

Phone number appears in: utility bar, footer, booking form note, and `js/main.js`
(the WhatsApp handoff number `917869139088`).

## NSCC practice-slot booking

`nscc.html` + `js/nscc-booking.js` take lane bookings against a Google Apps Script
backend in `booking-backend/` (setup steps in its README). The backend URL goes in
`data-endpoint` on `<form id="nscc-form">`; while it is empty, the form falls back to a
WhatsApp handoff. Dates and sessions are defined in **both** `js/nscc-booking.js` and
`booking-backend/Code.gs` (`CONFIG`) — change them together, along with `LANES` (4).
The page shows each session's lanes as dots (green = free, red = taken) and the shooter picks
one. `BLOCKED` in `js/nscc-booking.js` lists sessions shown booked out every day (currently
10–12 and 2–4). The backend does not yet return per-lane data (`taken`) or honour the chosen
lane — until it does, the page runs in WhatsApp mode (empty `data-endpoint`).
