/* NSCC practice-slot booking.
   Availability and bookings live in a Google Apps Script web app
   (see booking-backend/). Its URL goes in data-endpoint on #nscc-form.
   Keep CONFIG in step with booking-backend/Code.gs.                    */
(function () {
  'use strict';

  var CONFIG = {
    START: '2026-11-20',
    END: '2027-01-04',
    SESSIONS: [
      { id: '08-10', start: 8,  label: '8 – 10 AM' },
      { id: '10-12', start: 10, label: '10 AM – 12 PM' },
      { id: '12-14', start: 12, label: '12 – 2 PM' },
      { id: '14-16', start: 14, label: '2 – 4 PM' },
      { id: '16-18', start: 16, label: '4 – 6 PM' },
      { id: '18-20', start: 18, label: '6 – 8 PM' }
    ],
    LANES: 4,
    WHATSAPP: '917869139088',
    UPI: { id: 'bhopal10mshootingrange-3@okaxis', name: 'Bhopal Shooting Range Academy', amount: '500' }
  };

  var IST_OFFSET_MS = 5.5 * 3600 * 1000;
  var DAY_MS = 86400000;
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  var form = document.getElementById('nscc-form');
  if (!form) return;

  var endpoint = (form.getAttribute('data-endpoint') || '').trim();
  // Local testing only: ?api=local (or ?api=<url>) on localhost points at
  // booking-backend/local_test_server.py. Ignored on the live site.
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
    var apiParam = new URLSearchParams(location.search).get('api');
    if (apiParam) endpoint = apiParam === 'local' ? 'http://127.0.0.1:8001/' : apiParam;
  }
  var calEl = document.getElementById('nscc-cal');
  var sessionsEl = document.getElementById('nscc-sessions');
  var sessionsHint = document.getElementById('nscc-sessions-hint');
  var summaryEl = document.getElementById('nscc-summary');
  var statusEl = document.getElementById('nscc-status');
  var noticeEl = document.getElementById('nscc-notice');
  var submitBtn = document.getElementById('nscc-submit');
  var doneEl = document.getElementById('nscc-done');

  // mode: 'loading' → 'live' once availability arrives, or 'offline' (no endpoint / fetch failed)
  // full: session keys ("2026-11-20|16-18") with every lane taken.
  // taken: session key → array of lane numbers already booked.
  var state = { date: '', session: '', lane: 0, full: {}, taken: {}, mode: endpoint ? 'loading' : 'offline', busy: false };

  /* ---------------------------------------------------------- date utils */
  function parseISO(s) { var p = s.split('-'); return Date.UTC(+p[0], +p[1] - 1, +p[2]); }
  function toISO(ms) { return new Date(ms).toISOString().slice(0, 10); }
  function sessionStartMs(date, startHour) { return parseISO(date) + startHour * 3600000 - IST_OFFSET_MS; }
  function isPast(date, s) { return Date.now() >= sessionStartMs(date, s.start); }
  function prettyDate(date) {
    var d = new Date(parseISO(date));
    return WEEKDAYS[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + MONTHS[d.getUTCMonth()] + ' ' + d.getUTCFullYear();
  }
  function findSession(id) {
    for (var i = 0; i < CONFIG.SESSIONS.length; i++) if (CONFIG.SESSIONS[i].id === id) return CONFIG.SESSIONS[i];
    return null;
  }

  // Lane numbers (1..LANES) already taken in this session.
  function takenLanes(date, s) {
    var all = [];
    for (var i = 1; i <= CONFIG.LANES; i++) all.push(i);
    var key = date + '|' + s.id;
    if (state.full[key]) return all;
    return state.taken[key] || [];
  }
  function laneFree(date, s, lane) { return !isPast(date, s) && takenLanes(date, s).indexOf(lane) === -1; }

  // 'past' | 'full' | 'some' | 'open'
  function sessionState(date, s) {
    if (isPast(date, s)) return 'past';
    var n = takenLanes(date, s).length;
    return n >= CONFIG.LANES ? 'full' : n ? 'some' : 'open';
  }
  function bookable(date, s) { var st = sessionState(date, s); return st === 'open' || st === 'some'; }
  // Drop the chosen session / lane if it is no longer free.
  function keepSelectionValid() {
    var cur = findSession(state.session);
    if (cur && state.date && bookable(state.date, cur) && laneFree(state.date, cur, state.lane)) return;
    state.session = '';
    state.lane = 0;
  }
  function dayState(date) {
    var states = CONFIG.SESSIONS.map(function (s) { return sessionState(date, s); });
    var open = states.filter(function (x) { return x === 'open' || x === 'some'; }).length;
    if (!open) return 'full';
    return open < states.length || states.indexOf('some') !== -1 ? 'some' : 'open';
  }

  /* ------------------------------------------------------------ calendar */
  // One week (Mon–Sun) at a time, paged with the ‹ › buttons.
  var prevBtn = document.getElementById('nscc-prev');
  var nextBtn = document.getElementById('nscc-next');
  var weekLabel = document.getElementById('nscc-week');

  function mondayOf(ms) { return ms - ((new Date(ms).getUTCDay() + 6) % 7) * DAY_MS; }
  var FIRST_WEEK = mondayOf(parseISO(CONFIG.START));
  var LAST_WEEK = mondayOf(parseISO(CONFIG.END));
  // Open on the current week (IST) once the booking window has started.
  var todayIST = parseISO(toISO(Date.now() + IST_OFFSET_MS));
  state.week = Math.min(LAST_WEEK, Math.max(FIRST_WEEK, mondayOf(todayIST)));

  function shortDate(ms, withYear) {
    var d = new Date(ms);
    return d.getUTCDate() + ' ' + MONTHS[d.getUTCMonth()] + (withYear ? ' ' + d.getUTCFullYear() : '');
  }

  function renderCalendar() {
    var start = parseISO(CONFIG.START), end = parseISO(CONFIG.END);
    var html = '';
    for (var i = 0; i < 7; i++) {
      var t = state.week + i * DAY_MS;
      var d = new Date(t);
      var dow = WEEKDAYS[d.getUTCDay()];
      if (t < start || t > end) {
        html += '<span class="slotcal__day is-out" aria-hidden="true"><small>' + dow + '</small>' + d.getUTCDate() + '</span>';
        continue;
      }
      var iso = toISO(t);
      var ds = dayState(iso);
      var free = ds !== 'full';
      var cls = 'slotcal__day';
      var note;
      var live = state.mode === 'live';
      if (!free) { cls += ' is-full'; note = 'fully booked'; }
      else if (live && ds === 'some') { cls += ' is-few'; note = 'filling up'; }
      else { note = live ? 'available' : ''; }
      if (iso === state.date) cls += ' is-selected';
      html += '<button type="button" class="' + cls + '" data-date="' + iso + '"' +
        (free ? '' : ' disabled') +
        ' aria-pressed="' + (iso === state.date) + '"' +
        ' aria-label="' + prettyDate(iso) + (note ? ', ' + note : '') + '">' +
        '<small>' + dow + '</small>' + d.getUTCDate() + '</button>';
    }
    calEl.innerHTML = html;

    var last = state.week + 6 * DAY_MS;
    var sameMonth = new Date(state.week).getUTCMonth() === new Date(last).getUTCMonth();
    weekLabel.textContent = (sameMonth ? new Date(state.week).getUTCDate() : shortDate(state.week)) +
      ' – ' + shortDate(last, true);
    prevBtn.disabled = state.week <= FIRST_WEEK;
    nextBtn.disabled = state.week >= LAST_WEEK;
  }

  prevBtn.addEventListener('click', function () { state.week -= 7 * DAY_MS; renderCalendar(); });
  nextBtn.addEventListener('click', function () { state.week += 7 * DAY_MS; renderCalendar(); });

  calEl.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-date]');
    if (!btn || btn.disabled) return;
    state.date = btn.getAttribute('data-date');
    setStatus('');
    keepSelectionValid();
    render();
    var first = sessionsEl.querySelector('button:not([disabled])');
    if (first && !state.session) first.focus();
  });

  /* ------------------------------------------------------------ sessions */
  function renderSessions() {
    if (!state.date) {
      sessionsEl.innerHTML = '';
      sessionsHint.textContent = 'Pick a date above to see its sessions.';
      return;
    }
    sessionsHint.textContent = prettyDate(state.date) + ' — tap a green lane to pick it.';
    sessionsEl.innerHTML = CONFIG.SESSIONS.map(function (s) {
      var st = sessionState(state.date, s);
      var free = st === 'open' || st === 'some';
      var on = state.session === s.id;
      var taken = takenLanes(state.date, s);
      var freeCount = CONFIG.LANES - taken.length;
      var meta = st === 'past' ? 'Already started'
        : st === 'full' ? 'Booked out'
        : state.mode === 'loading' ? 'Checking…'
        : freeCount + ' of ' + CONFIG.LANES + ' lanes free';
      var lanes = '';
      for (var n = 1; n <= CONFIG.LANES; n++) {
        var past = st === 'past';
        var isFree = !past && taken.indexOf(n) === -1;
        var sel = on && state.lane === n;
        lanes += '<button type="button" class="lane ' + (past ? 'lane--past' : isFree ? 'lane--free' : 'lane--taken') +
          (sel ? ' is-selected' : '') + '" data-session="' + s.id + '" data-lane="' + n + '"' +
          (isFree ? '' : ' disabled') + ' aria-pressed="' + sel + '"' +
          ' aria-label="' + s.label + ', lane ' + n + ', ' + (past ? 'closed' : isFree ? 'available' : 'taken') + '">' +
          n + '</button>';
      }
      return '<div class="sessionopt' + (on ? ' is-selected' : '') + (free ? '' : ' is-off') + '">' +
        '<b>' + s.label + '</b><span>' + meta + '</span>' +
        '<div class="lanes" role="group" aria-label="Lanes for ' + s.label + '">' + lanes + '</div></div>';
    }).join('');
  }

  sessionsEl.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-lane]');
    if (!btn || btn.disabled) return;
    state.session = btn.getAttribute('data-session');
    state.lane = +btn.getAttribute('data-lane');
    setStatus('');
    render();
  });

  /* ------------------------------------------------------------- summary */
  function renderSummary() {
    var s = findSession(state.session);
    var parts = [];
    if (state.date) parts.push(prettyDate(state.date));
    if (s) parts.push(s.label);
    if (s && state.lane) parts.push('Lane ' + state.lane);
    summaryEl.textContent = parts.length ? parts.join(' · ') : 'No slot selected yet';
    summaryEl.classList.toggle('is-empty', !parts.length);
  }

  function render() {
    renderCalendar();
    renderSessions();
    renderSummary();
  }

  /* -------------------------------------------------------------- status */
  function setStatus(msg, kind) {
    statusEl.textContent = msg;
    statusEl.className = 'form__status' + (msg ? ' is-visible' : '') + (kind === 'error' ? ' is-error' : '');
  }

  /* -------------------------------------------------------- availability */
  function toSet(list) {
    var o = {};
    (list || []).forEach(function (k) { o[k] = true; });
    return o;
  }

  function loadAvailability() {
    if (!endpoint) return Promise.resolve();
    return fetch(endpoint + (endpoint.indexOf('?') === -1 ? '?' : '&') + 'action=slots', { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || !data.ok) throw new Error('bad response');
        state.full = toSet(data.full);
        state.taken = data.taken || {};
        state.mode = 'live';
        noticeEl.hidden = true;
        keepSelectionValid();
        render();
      })
      .catch(function () {
        state.mode = 'offline';
        render();
        noticeEl.textContent = 'Live lane availability couldn’t be loaded. You can still send a booking — ' +
          'we’ll tell you straight away if your slot has gone.';
        noticeEl.hidden = false;
      });
  }

  /* -------------------------------------------------------------- submit */
  function collect() {
    var d = new FormData(form);
    return {
      date: state.date,
      session: state.session,
      lane: state.lane,
      name: String(d.get('name') || '').trim(),
      phone: String(d.get('phone') || '').trim(),
      email: String(d.get('email') || '').trim(),
      team: String(d.get('team') || '').trim(),
      website: String(d.get('website') || '')
    };
  }

  function validate(b) {
    if (!b.date) return 'Please pick a date.';
    if (!b.session || !b.lane) return 'Please pick a session and lane (tap a green dot).';
    if (b.name.length < 2) return 'Please enter your name.';
    var digits = b.phone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) return 'Please enter a valid phone number.';
    if (!b.email) return 'Please enter your email — your confirmation and payment details are sent there.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) return 'Please check your email address.';
    return '';
  }

  function showDone(b, res) {
    var s = findSession(b.session);
    doneEl.querySelector('[data-done="lane"]').textContent = 'Lane ' + res.lane;
    doneEl.querySelector('[data-done="when"]').textContent = prettyDate(b.date) + ' · ' + s.label;
    doneEl.querySelector('[data-done="ref"]').textContent = res.ref;
    doneEl.querySelector('[data-done="mail"]').hidden = !b.email;
    renderPayment(res.ref);
    form.hidden = true;
    doneEl.hidden = false;
    // The confirmation is much shorter than the form it replaces, so bring its top
    // (and the payment QR) into view; scroll-padding keeps it below the sticky header.
    doneEl.scrollIntoView({ block: 'start' });
    doneEl.focus({ preventScroll: true });
  }

  /* ------------------------------------------------------------- payment */
  function upiLink(ref) {
    return 'upi://pay?pa=' + CONFIG.UPI.id +
      '&pn=' + encodeURIComponent(CONFIG.UPI.name) +
      '&am=' + CONFIG.UPI.amount + '&cu=INR' +
      '&tn=' + encodeURIComponent(ref);   // reference only, so a truncated bank statement still shows it
  }

  function renderPayment(ref) {
    var link = upiLink(ref);
    doneEl.querySelector('[data-done="amt"]').textContent = '₹' + CONFIG.UPI.amount;
    doneEl.querySelector('[data-done="upi"]').setAttribute('href', link);
    var box = doneEl.querySelector('[data-done="qr"]');
    var save = doneEl.querySelector('[data-done="save"]');
    if (typeof window.qrcode !== 'function') { box.hidden = true; save.hidden = true; return; }
    var qr = window.qrcode(0, 'M');
    qr.addData(link);
    qr.make();
    box.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 4, scalable: true });
    box.hidden = false;
    // A PNG copy, so a shooter on a phone can pay via "scan from gallery" in their UPI app.
    var png = qrPng(qr, ref);
    save.hidden = !png;
    if (png) { save.href = png; save.setAttribute('download', ref + '-upi-qr.png'); }
  }

  function qrPng(qr, ref) {
    try {
      var n = qr.getModuleCount(), cell = 10, quiet = 4 * cell, size = n * cell + quiet * 2, foot = 70;
      var c = document.createElement('canvas');
      c.width = size; c.height = size + foot;
      var g = c.getContext('2d');
      g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
      g.fillStyle = '#000';
      for (var r = 0; r < n; r++) for (var col = 0; col < n; col++) {
        if (qr.isDark(r, col)) g.fillRect(quiet + col * cell, quiet + r * cell, cell, cell);
      }
      g.textAlign = 'center';
      g.font = 'bold 26px sans-serif';
      g.fillText('₹' + CONFIG.UPI.amount + '  ·  ' + ref, size / 2, size + 18);
      g.font = '18px sans-serif';
      g.fillText(CONFIG.UPI.name, size / 2, size + 48);
      return c.toDataURL('image/png');
    } catch (err) {
      return '';
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (state.busy) return;
    var b = collect();
    var problem = validate(b);
    if (problem) { setStatus(problem, 'error'); return; }

    // Not wired to the backend yet: hand the booking over on WhatsApp instead.
    if (!endpoint) {
      var s = findSession(b.session);
      var text = ['NSCC practice slot request',
        'Date: ' + prettyDate(b.date), 'Session: ' + s.label, 'Lane: ' + b.lane,
        'Name: ' + b.name, 'Phone: ' + b.phone, 'Email: ' + (b.email || '-'),
        'Team/State: ' + (b.team || '-'),
        '',
        'Fee: Rs ' + CONFIG.UPI.amount + ' per session.',
        'To confirm this slot, pay Rs ' + CONFIG.UPI.amount + ' by UPI to ' + CONFIG.UPI.id +
          ' (' + CONFIG.UPI.name + ') and send the payment screenshot in this WhatsApp chat.',
        'Your lane is confirmed once we receive the screenshot.'].join('\n');
      setStatus('WhatsApp is opening with your request. Send it, pay ₹' + CONFIG.UPI.amount +
        ' by UPI, and share the payment screenshot in the same chat to confirm your lane.');
      window.open('https://wa.me/' + CONFIG.WHATSAPP + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
      return;
    }

    state.busy = true;
    submitBtn.disabled = true;
    submitBtn.firstChild.textContent = 'Booking… ';
    setStatus('');

    // text/plain keeps this a "simple" request, which Apps Script accepts cross-origin.
    fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(b) })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res && res.ok) {
          showDone(b, res);
          return loadAvailability();
        }
        setStatus((res && res.message) || 'Something went wrong. Please try again.', 'error');
        // Someone else got there first: refresh the lanes so the shooter can pick again.
        if (res && (res.error === 'full' || res.error === 'taken')) {
          state.session = '';
          state.lane = 0;
          return loadAvailability();
        }
      })
      .catch(function () {
        setStatus('We couldn’t reach the booking system. Please try again, or call / WhatsApp +91 78691 39088.', 'error');
      })
      .then(function () {
        state.busy = false;
        submitBtn.disabled = false;
        submitBtn.firstChild.textContent = 'Book My Lane ';
      });
  });

  document.getElementById('nscc-again').addEventListener('click', function () {
    state.date = '';
    state.session = '';
    state.lane = 0;
    form.reset();
    setStatus('');
    doneEl.hidden = true;
    form.hidden = false;
    render();
    form.querySelector('h3').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  if (!endpoint) {
    noticeEl.textContent = 'Sending this form opens WhatsApp with your chosen slot and lane. Pay ₹' +
      CONFIG.UPI.amount + ' by UPI and send the screenshot in that chat to confirm.';
    noticeEl.hidden = false;
  }

  render();
  loadAvailability();
})();
