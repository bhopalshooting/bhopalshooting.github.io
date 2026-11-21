# NSCC practice booking — backend setup

The booking page (`nscc.html`) is static. Lane availability, bookings and email
notifications are handled by a small Google Apps Script web app attached to a Google
Sheet. It is free, runs on the range's Google account, and the Sheet doubles as the
bookings register.

## One-time setup (about 10 minutes)

1. **Create the Sheet.** In Google Drive, create a new Google Sheet, e.g.
   "NSCC Practice Bookings".
2. **Add the script.** In the Sheet, open **Extensions → Apps Script**. Replace the
   contents of `Code.gs` with this folder's `Code.gs` and save.
3. **Set the timezone.** In the Apps Script editor go to **Project Settings** (gear icon)
   and set the time zone to **(GMT+05:30) India Standard Time**.
4. **Set the notification address.** Still in **Project Settings → Script Properties**,
   add a property:
   - Property: `NOTIFY_EMAIL`
   - Value: the address that should receive every booking

   (The address lives here rather than in the code because this repository is public.)
5. **Deploy.** Click **Deploy → New deployment**, choose type **Web app**, and set:
   - Execute as: **Me**
   - Who has access: **Anyone**

   Click **Deploy** and approve the permissions it asks for: it needs to edit this Sheet
   and send email as you. Copy the **Web app URL** (it ends in `/exec`).
6. **Connect the site.** In `nscc.html`, paste the URL into the form's `data-endpoint`:

   ```html
   <form class="form nscc-form" id="nscc-form" novalidate data-endpoint="https://script.google.com/macros/s/…/exec">
   ```

   Commit and push. The page now shows live lane availability.

To check the deployment, open `<web app URL>?action=slots` in a browser. You should see
`{"ok":true,"full":[],"some":[]}`.

## Day-to-day

- Every booking adds a row to the **Bookings** tab and emails `NOTIFY_EMAIL`. If the
  shooter gave an email address, they get a confirmation with their reference too.
- **To cancel a booking**, set its **Status** cell to `Cancelled`. The lane becomes free
  on the site straight away.
- **To block a lane** (maintenance, private use), add a row by hand with the date
  (`2026-12-05`), session id (`09-11`, `11-13`, `13-15`, `15-17`, `17-19` or `19-21`),
  lane number and Status `Confirmed`. Fill every lane to close a whole session.

## Changing dates, sessions or lanes

Dates and sessions live in `CONFIG` in **both** `Code.gs` and `js/nscc-booking.js`;
change them together. The number of lanes (`LANES`) is only in `Code.gs`: the site is
told just which sessions are full or partly booked, so it never shows capacity. After
editing `Code.gs`, publish it with **Deploy → Manage deployments → Edit → New version**.

## Notes

- If you edit the code after deploying, publish a **new version** of the existing
  deployment rather than a new deployment. A new deployment gets a new URL, which would
  then have to be updated in `nscc.html`.
- Gmail accounts can send about 100 emails a day from Apps Script. A completely full day
  is 12 bookings (6 sessions × 2 lanes), at most 24 emails, so there is plenty of room.
