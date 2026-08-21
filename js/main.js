/* Bhopal Shooting Range Academy — small progressive-enhancement helpers */
(function () {
  'use strict';

  /* ---------------------------------------------------------- mobile nav */
  var toggle = document.querySelector('.navtoggle');
  var nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* -------------------------------------------------------- events tabs */
  var tablist = document.querySelector('[role="tablist"]');
  if (tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));

    function select(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () { select(tab); });
    });

    tablist.addEventListener('keydown', function (e) {
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      var next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (next) { e.preventDefault(); next.focus(); select(next); }
    });
  }

  /* ------------------------------------------------------ scroll reveal */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });
    Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-in'); });
  }

  /* -------------------------------------------------- booking form (static)
     No backend on a static site: we compose a WhatsApp / mail message
     from the fields so the enquiry still reaches the range.            */
  var form = document.getElementById('booking-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var lines = [
        'New session enquiry — Bhopal Shooting Range Academy',
        'Name: ' + (d.get('name') || ''),
        'Phone: ' + (d.get('phone') || ''),
        'Email: ' + (d.get('email') || ''),
        'Interest: ' + (d.get('program') || ''),
        'Preferred date: ' + (d.get('date') || ''),
        'Message: ' + (d.get('message') || '')
      ];
      var text = lines.join('\n');
      var status = document.getElementById('form-status');
      if (status) {
        status.textContent = 'Thanks, ' + (d.get('name') || 'shooter') +
          '! Your enquiry is ready to send — WhatsApp is opening in a new tab. ' +
          'You can also call us directly on +91 78691 39088.';
        status.classList.add('is-visible');
      }
      window.open('https://wa.me/917869139088?text=' + encodeURIComponent(text), '_blank', 'noopener');
      form.reset();
    });
  }

  /* --------------------------------------------------------- year stamp */
  var year = document.querySelectorAll('[data-year]');
  Array.prototype.forEach.call(year, function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
