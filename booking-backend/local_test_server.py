"""Local stand-in for the Google Apps Script booking backend — for testing only.

Speaks the same API as Code.gs (availability + bookings), keeps everything in
memory, and sends no email. Bookings vanish when it stops.

    python3 booking-backend/local_test_server.py
    then open http://localhost:8000/nscc.html?api=local
"""
import json
import uuid
from datetime import datetime, timedelta, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

IST = timezone(timedelta(hours=5, minutes=30))
SESSIONS = {'08-10': 8, '10-12': 10, '12-14': 12, '14-16': 14, '16-18': 16, '18-20': 18, '20-22': 20}
LANES = 4
rows = []


class Handler(BaseHTTPRequestHandler):
    def _send(self, obj):
        body = json.dumps(obj).encode()
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        counts = {}
        for r in rows:
            counts[r['key']] = counts.get(r['key'], 0) + 1
        taken = {}
        for r in rows:
            taken.setdefault(r['key'], []).append(r['lane'])
        self._send({'ok': True,
                    'full': [k for k, v in counts.items() if v >= LANES],
                    'some': [k for k, v in counts.items() if v < LANES],
                    'taken': taken})

    def do_POST(self):
        d = json.loads(self.rfile.read(int(self.headers['Content-Length'])))
        if '@' not in d.get('email', ''):
            return self._send({'ok': False, 'error': 'invalid', 'message': 'Please enter a valid email address.'})
        if d.get('session') not in SESSIONS:
            return self._send({'ok': False, 'error': 'invalid', 'message': 'Please choose a session.'})
        start = datetime.fromisoformat('%sT%02d:00:00+05:30' % (d['date'], SESSIONS[d['session']]))
        if start <= datetime.now(IST):
            return self._send({'ok': False, 'error': 'invalid', 'message': 'That session has already started.'})
        key = d['date'] + '|' + d['session']
        phone = ''.join(ch for ch in d.get('phone', '') if ch.isdigit())
        in_slot = [r for r in rows if r['key'] == key]
        if any(r['phone'] == phone for r in in_slot):
            return self._send({'ok': False, 'error': 'duplicate',
                               'message': 'This phone number is already booked into that session.'})
        used = [r['lane'] for r in in_slot]
        if len(used) >= LANES:
            return self._send({'ok': False, 'error': 'full',
                               'message': 'That session has just been fully booked. Please pick another slot.'})
        wanted = d.get('lane')
        if isinstance(wanted, int) and 1 <= wanted <= LANES:
            if wanted in used:
                return self._send({'ok': False, 'error': 'taken',
                                   'message': 'Lane %d in that session has just been taken. Please pick another lane.' % wanted})
            lane = wanted
        else:
            lane = next(n for n in range(1, LANES + 1) if n not in used)
        ref = 'NSCC-' + uuid.uuid4().hex[:6].upper()
        rows.append({'key': key, 'lane': lane, 'phone': phone})
        print('Booked %s: %s %s lane %d — %s' % (ref, d['date'], d['session'], lane, d.get('name')))
        self._send({'ok': True, 'lane': lane, 'ref': ref})

    def log_message(self, *args):
        pass


if __name__ == '__main__':
    print('Local booking backend on http://127.0.0.1:8001 — open http://localhost:8000/nscc.html?api=local')
    ThreadingHTTPServer(('127.0.0.1', 8001), Handler).serve_forever()
