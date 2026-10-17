/* ═══════════════════════════════════════════════════════════
   ACME Fertility — Digital Portfolio
   Vanilla JS. No dependencies. Every effect honours
   prefers-reduced-motion by rendering the final state.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var prefersReduced = function () { return reduceMotion.matches; };

  /* ───────── 0. Loading screen: heartbeat, then reveal ───────── */
var loader = document.getElementById('loader');
if (loader) {
  var MIN_SHOW = 1900;                       // ~1.3 heartbeat cycles
  var t0 = Date.now();
  document.body.style.overflow = 'hidden';   // no scroll behind the loader

  function finishLoad() {
    if (loader.classList.contains('is-done')) return;
    loader.classList.add('is-done');
    document.documentElement.classList.add('is-loaded');
    document.body.style.overflow = '';
    setTimeout(function () { loader.remove(); }, 1000); // after curtains fully part
  }

  if (prefersReduced()) {
    finishLoad();                            // reduced motion: skip entirely
  } else {
    var wait = Math.max(0, MIN_SHOW - (Date.now() - t0));
    window.addEventListener('load', function () {
      setTimeout(finishLoad, wait);
    });
    setTimeout(finishLoad, 4000);            // safety net — never trap the user
  }
}

  /* ───────── 1. Footer year ───────── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ───────── 2. Scroll progress + sticky header ───────── */
  var progressBar = document.getElementById('progressBar');
  var header = document.getElementById('siteHeader');
  var ticking = false;

  function onScrollFrame() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progressBar) progressBar.style.width = pct.toFixed(2) + '%';
    if (header) header.classList.toggle('is-stuck', window.scrollY > 8);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScrollFrame); }
  }, { passive: true });
  onScrollFrame();

  /* ───────── 3. Scroll reveal (staggered, one-shot) ───────── */
    var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal, .timeline__item'));

  revealEls.forEach(function (el) {
    var delay = el.getAttribute('data-delay');
    if (delay) el.style.setProperty('--reveal-delay', delay + 'ms');
  });

  if (prefersReduced() || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ───────── 4. Count-up numbers ───────── */
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;

    if (prefersReduced()) {
      el.textContent = target.toLocaleString('en-IN') + suffix;
      return;
    }

    var duration = 1500;
    var start = null;

    function step(now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / duration, 1);
      // easeOutExpo
      var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = Math.round(target * eased).toLocaleString('en-IN') + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
  if (!('IntersectionObserver' in window)) {
    counters.forEach(countUp);
  } else {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        countObserver.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* ───────── 5. Hero parallax (transform only, rAF-throttled) ───────── */
  var bento = document.getElementById('heroBento');
  if (bento && !prefersReduced()) {
    var pTicking = false;
    window.addEventListener('scroll', function () {
      if (pTicking) return;
      pTicking = true;
      requestAnimationFrame(function () {
        var shift = Math.min(window.scrollY * 0.06, 34);
        bento.style.transform = 'translate3d(0,' + (-shift).toFixed(2) + 'px,0)';
        pTicking = false;
      });
    }, { passive: true });
  }

  /* ───────── 6. Magnetic buttons (pointer only) ───────── */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReduced()) {
    Array.prototype.forEach.call(document.querySelectorAll('.btn--mag'), function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        var dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        btn.style.transform = 'translate(' + (dx * 5).toFixed(2) + 'px,' + (dy * 4).toFixed(2) + 'px)';
      });
      btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
    });
  }

  /* ───────── 7. Mobile nav ───────── */
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
        navToggle.focus();
      }
    });
  }

  /* ───────── 8. Active nav link via section observer ───────── */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav > a[href^="#"]'));
  var sectionIds = navLinks.map(function (a) { return a.getAttribute('href').slice(1); });
  var sections = sectionIds
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-current', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ───────── 9. Media slots: upgrade placeholders to real files ─────────
     Any [data-img] / [data-video] slot stays a styled placeholder until the
     file actually exists in assets/ — then it swaps itself in. Drop the file
     in and reload; no markup edits needed. */
  /* Header logo: show the real file if it exists, otherwise keep the
     placeholder mark + wordmark. The <img> carries an empty alt because the
     parent <a> already has an aria-label. */
  function revealLogo(img, ownerSelector) {
    if (!img) return;
    var owner = img.closest(ownerSelector);
    if (!owner) return;
    var show = function () { owner.classList.add('has-logo'); };
    if (img.complete && img.naturalWidth > 0) show();
    else img.addEventListener('load', show);
  }
  revealLogo(document.querySelector('.brand__img'), '.brand');
  revealLogo(document.querySelector('.footer__logo'), '.site-footer');

  Array.prototype.forEach.call(document.querySelectorAll('[data-img]'), function (slot) {
    var src = slot.getAttribute('data-img');
    var probe = new Image();
    probe.onload = function () {
      slot.style.backgroundImage = 'url("' + src + '")';
      slot.classList.add('has-img');
    };
    probe.src = src;
  });

  Array.prototype.forEach.call(document.querySelectorAll('[data-video]'), function (slot) {
    var src = slot.getAttribute('data-video');
    fetch(src, { method: 'HEAD' }).then(function (res) {
      if (!res.ok) return;
      var v = document.createElement('video');
      v.src = src;
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.controls = true;
      v.preload = 'metadata';
      slot.insertBefore(v, slot.firstChild);
      slot.classList.add('has-video');
    }).catch(function () { /* no file yet — keep the placeholder */ });
  });

  /* Hero: reveal the <video> only if the source actually loads */
  /* Hero panel media: only reveal it once the file has actually decoded, so a
     missing or broken image leaves the CSS art showing rather than a gap. */
  var heroMedia = document.getElementById('heroMedia');
  if (heroMedia) {
    var showHero = function () {
      heroMedia.closest('.hero__clip').classList.add('has-media');
    };
    if (heroMedia.complete && heroMedia.naturalWidth > 0) showHero();
    else heroMedia.addEventListener('load', showHero);
  }

  /* ───────── 10. Testimonial carousel ─────────
     Previous/next + play/pause, full keyboard access, live slide position.
     Rotation stops on hover, focus, offscreen and reduced motion. */
  (function voicesCarousel() {
    var track = document.getElementById('voicesTrack');
    var root = document.getElementById('voicesCarousel');
    if (!track || !root) return;

    var slides = Array.prototype.slice.call(track.children);
    var prevBtn = document.getElementById('voicesPrev');
    var nextBtn = document.getElementById('voicesNext');
    var playBtn = document.getElementById('voicesPlay');
    var status = document.getElementById('voicesStatus');

    var index = 0;
    var timer = null;
    var userPaused = false;
    var INTERVAL = 6000;

    function render() {
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      slides.forEach(function (s, i) { s.setAttribute('aria-hidden', i === index ? 'false' : 'true'); });
      if (status) status.textContent = 'Slide ' + (index + 1) + ' of ' + slides.length;
    }

    function go(delta) {
      index = (index + delta + slides.length) % slides.length;
      render();
    }

    function start() {
      if (timer || userPaused || prefersReduced() || slides.length < 2) return;
      timer = setInterval(function () { go(1); }, INTERVAL);
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { go(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(1); });

    if (playBtn) {
      // reduced motion: rotation never runs, so the control reflects paused state
      if (prefersReduced()) {
        userPaused = true;
        playBtn.setAttribute('aria-pressed', 'true');
        playBtn.setAttribute('aria-label', 'Play testimonial rotation');
      }
      playBtn.addEventListener('click', function () {
        userPaused = !userPaused;
        playBtn.setAttribute('aria-pressed', userPaused ? 'true' : 'false');
        playBtn.setAttribute('aria-label', userPaused ? 'Play testimonial rotation' : 'Pause testimonial rotation');
        if (userPaused) stop(); else start();
      });
    }

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);

    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { go(-1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { go(1); e.preventDefault(); }
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { en.isIntersecting ? start() : stop(); });
      }, { threshold: 0.25 }).observe(root);
    } else {
      start();
    }

    render();
  })();

  /* ───────── 11. Duplicate marquee content for a seamless loop ───────── */
  var marqueeTrack = document.querySelector('.marquee__track');
  if (marqueeTrack) marqueeTrack.innerHTML += marqueeTrack.innerHTML;

})();
