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
   - Value: the address that should receive every booking (e.g. the range owner's Gmail)

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

- Every booking adds a row to the **Bookings** tab and emails `NOTIFY_EMAIL`. The shooter
  (email is required on the form) gets a confirmation with their reference and the UPI
  payment details. Replying to your notification email goes straight to the shooter.
- **Matching payments.** Each booking's UPI QR code puts its reference (e.g. `NSCC-51AC6C`)
  in the payment note. New bookings start with **Payment** = `Pending`. When you see that
  reference on a received payment in your UPI app or bank statement, set **Payment** to
  `Paid`. Filter the column for `Pending` to see who still owes. (The column is added
  automatically to an existing Bookings sheet on the next booking.)
- **To cancel a booking**, set its **Status** cell to `Cancelled`. The lane becomes free
  on the site straight away.
- **To block a lane** (maintenance, private use), add a row by hand with the date
  (`2026-12-05`), session id (`08-10`, `10-12`, `12-14`, `14-16`, `16-18`, `18-20` or `20-22`),
  lane number and Status `Confirmed`. Fill every lane to close a whole session.

## Changing dates, sessions or lanes

Dates, sessions and the number of lanes (`LANES`) live in `CONFIG` in **both**
`Code.gs` and `js/nscc-booking.js`; change them together. The fee is `FEE` in `Code.gs`
(emails) and `UPI.amount` in `js/nscc-booking.js` (QR code), plus the text in
`nscc.html`. After editing `Code.gs`, publish it with
**Deploy → Manage deployments → Edit → New version**.

## Testing locally

Run `python3 -m http.server 8000` in the repo and, in a second terminal,
`python3 booking-backend/local_test_server.py`, then open
`http://localhost:8000/nscc.html?api=local`. The local server speaks the same API as
`Code.gs` but keeps bookings in memory and sends no email. `?api=` is ignored on the
live site.

## Notes

- If you edit the code after deploying, publish a **new version** of the existing
  deployment rather than a new deployment. A new deployment gets a new URL, which would
  then have to be updated in `nscc.html`.
- Gmail accounts can send to about 100 recipients a day from Apps Script. A completely
  full day is 28 bookings (7 sessions × 4 lanes), at most 56 emails, so there is room.
- Emails are sent from the Google account that owns the script, so shooters see that
  address as the sender. Use the range's own Google account if you have one.
- The first time you authorise, Google warns that the app "isn't verified". That is
  normal for a script you wrote yourself: choose **Advanced → Go to (project name)**.
