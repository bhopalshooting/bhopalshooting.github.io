/**
 * NSCC practice-slot booking backend — Google Apps Script web app.
 *
 * Bind this script to a Google Sheet (Extensions → Apps Script), set the
 * NOTIFY_EMAIL script property, and deploy as a web app. See README.md.
 *
 *   GET  ?action=slots   → { ok, full: [...], some: [...],
 *                            taken: { "2026-12-17|14-16": [1, 3], ... } }   (lane numbers in use)
 *   POST (JSON as text/plain) { date, session, lane, name, phone, email,
 *        team?, website? }          — lane is the lane the shooter picked (1..LANES)
 *                        → { ok, lane, ref }  |  { ok:false, error, message }
 *
 * Keep CONFIG in step with the CONFIG block at the top of js/nscc-booking.js.
 */

var CONFIG = {
  START: '2026-11-20',          // first bookable day (inclusive)
  END: '2027-01-04',            // last bookable day (inclusive)
  SESSIONS: {                   // id → [start hour, label]
    '08-10': [8,  '8 – 10 AM'],
    '10-12': [10, '10 AM – 12 PM'],
    '12-14': [12, '12 – 2 PM'],
    '14-16': [14, '2 – 4 PM'],
    '16-18': [16, '4 – 6 PM'],
    '18-20': [18, '6 – 8 PM'],
    '20-22': [20, '8 – 10 PM']
  },
  LANES: 4,                     // shooters per session (keep in step with LANES in js/nscc-booking.js)
  DISCIPLINES: ['Rifle', 'Pistol'],
  FEE: '₹500',
  UPI_ID: 'bhopal10mshootingrange-3@okaxis',
  TZ: 'Asia/Kolkata',
  SHEET: 'Bookings'
};

var HEADERS = ['Ref', 'Booked at (IST)', 'Date', 'Session', 'Lane', 'Discipline',
               'Name', 'Phone', 'Email', 'Team / State', 'Notes', 'Status', 'Payment'];
var COL = { ref: 0, date: 2, session: 3, lane: 4, phone: 7, status: 11, payment: 12 };
var PAYMENT_STATES = ['Pending', 'Paid'];

/* ------------------------------------------------------------- endpoints */

function doGet(e) {
  var action = e && e.parameter ? e.parameter.action : '';
  if (action === 'slots') {
    var taken = takenLanes_(), full = [], some = [];
    Object.keys(taken).forEach(function (k) { (taken[k].length >= CONFIG.LANES ? full : some).push(k); });
    return json_({ ok: true, full: full, some: some, taken: taken });
  }
  return json_({ ok: true, service: 'nscc-booking' });
}

function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return fail_('invalid', 'The booking request could not be read.');
  }

  // Honeypot: real visitors never fill the hidden "website" field.
  if (data.website) return json_({ ok: true, lane: 0, ref: '-' });

  var problem = validate_(data);
  if (problem) return fail_('invalid', problem);

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
  } catch (err) {
    return fail_('busy', 'The booking system is busy. Please try again in a moment.');
  }

  var booking;
  try {
    var sheet = sheet_();
    var key = data.date + '|' + data.session;
    var phone = normPhone_(data.phone);
    var inSlot = activeRows_(sheet).filter(function (r) { return r.key === key; });

    if (inSlot.some(function (r) { return r.phone === phone; })) {
      return fail_('duplicate', 'This phone number is already booked into that session.');
    }

    var used = inSlot.map(function (r) { return r.lane; });
    if (used.length >= CONFIG.LANES) {
      return fail_('full', 'That session has just been fully booked. Please pick another slot.');
    }
    var lane = 0;
    var wanted = Number(data.lane);
    if (wanted >= 1 && wanted <= CONFIG.LANES && Math.floor(wanted) === wanted) {
      // Book exactly the lane the shooter picked, unless someone has just taken it.
      if (used.indexOf(wanted) !== -1) {
        return fail_('taken', 'Lane ' + wanted + ' in that session has just been taken. Please pick another lane.');
      }
      lane = wanted;
    } else {
      for (var l = 1; l <= CONFIG.LANES; l++) {
        if (used.indexOf(l) === -1) { lane = l; break; }
      }
    }

    booking = {
      ref: 'NSCC-' + Utilities.getUuid().replace(/-/g, '').slice(0, 6).toUpperCase(),
      bookedAt: Utilities.formatDate(new Date(), CONFIG.TZ, 'yyyy-MM-dd HH:mm'),
      date: data.date,
      session: data.session,
      lane: lane,
      discipline: clip_(data.discipline, 20),   // no longer asked on the page; column kept for old rows
      name: clip_(data.name, 80),
      phone: clip_(data.phone, 20),
      email: clip_(data.email, 120),
      team: clip_(data.team, 80),
      notes: clip_(data.notes, 500)
    };

    var row = [booking.ref, booking.bookedAt, booking.date, booking.session,
               String(booking.lane), booking.discipline, booking.name, booking.phone,
               booking.email, booking.team, booking.notes, 'Confirmed', 'Pending'].map(cell_);
    sheet.getRange(sheet.getLastRow() + 1, 1, 1, row.length)
         .setNumberFormat('@')
         .setValues([row]);
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }

  notify_(booking);
  return json_({ ok: true, lane: booking.lane, ref: booking.ref });
}

/* --------------------------------------------------------------- helpers */

function validate_(d) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date || '') || d.date < CONFIG.START || d.date > CONFIG.END) {
    return 'Please choose a date between 20 November and 4 January.';
  }
  var s = CONFIG.SESSIONS[d.session];
  if (!s) return 'Please choose a session.';
  var hh = (s[0] < 10 ? '0' : '') + s[0];
  if (new Date(d.date + 'T' + hh + ':00:00+05:30').getTime() <= Date.now()) {
    return 'That session has already started. Please pick a later slot.';
  }
  if (!d.name || String(d.name).trim().length < 2) return 'Please enter your name.';
  var digits = normPhone_(d.phone);
  if (digits.length < 10 || digits.length > 15) return 'Please enter a valid phone number.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(d.email || ''))) return 'Please enter a valid email address.';
  return '';
}

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(CONFIG.SHEET);
  if (!sh) {
    sh = ss.insertSheet(CONFIG.SHEET);
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    sh.setFrozenRows(1);
    // Status column: dropdown so the range can cancel a booking and free the lane.
    sh.getRange('L2:L').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(['Confirmed', 'Cancelled'], true).build());
  }
  ensurePaymentColumn_(sh);
  return sh;
}

/** Adds the Payment column (Pending / Paid dropdown) — also to a sheet created before it existed. */
function ensurePaymentColumn_(sh) {
  var col = COL.payment + 1;
  var head = sh.getRange(1, col);
  if (head.getValue() === 'Payment') return;
  head.setValue('Payment').setFontWeight('bold');
  sh.getRange(2, col, sh.getMaxRows() - 1, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(PAYMENT_STATES, true).build());
  // Bookings made before this column existed start as Pending.
  var n = sh.getLastRow() - 1;
  if (n > 0) {
    var refs = sh.getRange(2, 1, n, 1).getValues();
    sh.getRange(2, col, n, 1).setValues(refs.map(function (r) { return [r[0] ? 'Pending' : '']; }));
  }
}

/** Bookings that still hold a lane (anything not marked Cancelled). */
function activeRows_(sheet) {
  var n = sheet.getLastRow() - 1;
  if (n < 1) return [];
  return sheet.getRange(2, 1, n, HEADERS.length).getDisplayValues()
    .filter(function (r) { return r[COL.ref] && String(r[COL.status]).trim().toLowerCase() !== 'cancelled'; })
    .map(function (r) {
      return {
        key: r[COL.date] + '|' + r[COL.session],
        lane: Number(r[COL.lane]),
        phone: normPhone_(r[COL.phone])
      };
    });
}

/** session key → lane numbers currently booked (Cancelled rows excluded). */
function takenLanes_() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET);
  var taken = {};
  if (!sheet) return taken;
  activeRows_(sheet).forEach(function (r) {
    if (!taken[r.key]) taken[r.key] = [];
    if (r.lane && taken[r.key].indexOf(r.lane) === -1) taken[r.key].push(r.lane);
  });
  return taken;
}

function notify_(b) {
  var label = CONFIG.SESSIONS[b.session][1];
  var when = Utilities.formatDate(new Date(b.date + 'T12:00:00+05:30'), CONFIG.TZ, 'EEE d MMM yyyy');
  var lines = [
    'New NSCC practice booking',
    '',
    'Ref:        ' + b.ref,
    'Date:       ' + when,
    'Session:    ' + label,
    'Lane:       ' + b.lane,
    '',
    'Name:       ' + b.name,
    'Phone:      ' + b.phone,
    'Email:      ' + (b.email || '-'),
    'Team/State: ' + (b.team || '-'),
    'Notes:      ' + (b.notes || '-'),
    '',
    'Fee:        ' + CONFIG.FEE + ' — the shooter has been sent to WhatsApp to ask for the payment QR.',
    'Payment:    Pending — reply on WhatsApp with the QR (ask them to put ' + b.ref + ' in the note),',
    '            then set Payment to "Paid" in the Bookings sheet once it arrives.',
    '',
    'To cancel, set Status to "Cancelled" in the Bookings sheet — the lane becomes free again.'
  ];

  var to = PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL');
  try {
    if (to) {
      var opts = {};
      if (b.email) opts.replyTo = b.email;
      MailApp.sendEmail(to, 'NSCC practice: ' + when + ', ' + label + ' — Lane ' + b.lane,
                        lines.join('\n'), opts);
    } else {
      console.error('NOTIFY_EMAIL script property is not set; no notification sent for ' + b.ref);
    }
    if (b.email) {
      MailApp.sendEmail(b.email, 'Your practice lane is booked — ' + when + ', ' + label,
        ['Hi ' + b.name + ',', '',
         'Your practice lane at Bhopal Shooting Range Academy is booked.', '',
         'Date:       ' + when,
         'Session:    ' + label,
         'Lane:       ' + b.lane,
         'Reference:  ' + b.ref, '',
         'Practice fee: ' + CONFIG.FEE + ' for the 2-hour session.',
         'We will send you the payment QR on WhatsApp. If WhatsApp did not open after booking,',
         'message +91 78691 39088 with your reference and we will send it there.', '',
         'Need to change or cancel? Call or WhatsApp +91 78691 39088 and quote your reference.', '',
         'Bhopal Shooting Range Academy — Aim · Focus · Achieve'].join('\n'),
        { name: 'Bhopal Shooting Range Academy' });
    }
  } catch (err) {
    // The booking is already saved; a mail failure must not undo it.
    console.error('Notification failed for ' + b.ref + ': ' + err);
  }
}

function normPhone_(p) { return String(p || '').replace(/\D/g, ''); }

function clip_(v, max) { return String(v == null ? '' : v).trim().slice(0, max); }

/** Stop user text being interpreted as a spreadsheet formula. */
function cell_(v) { return /^[=+\-@]/.test(v) ? "'" + v : v; }

function fail_(code, message) { return json_({ ok: false, error: code, message: message }); }

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
