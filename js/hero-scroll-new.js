/* Pinned-hero scroll effects + show/hide nav + care card scroller.
   NAV   — visible at the top of the page; hides once the user scrolls away
           from the top (so the pinned hero gets its clean full-screen
           hand-off); slides back in and stays once the Split Statement
           reaches the top; returns when scrolling back to the very top.
   HERO  — the hero is position:sticky; the figure scales back and the type
           fades as the page scrolls over it (Vision Pro hand-off). Hero
           load animations in bold.css must use fill-mode "backwards".
   OVAL  — index-new.html only: drives --p/--q/--r on .hero--oval so the
           ellipse opens into a full-bleed photograph on scroll.
   CARE  — 3-up carousel: centre card shows text + photo, side cards are
           full-bleed photos. layout() measures the centre card at natural
           height and pins every card, because the CSS height:100% makes a
           plain offsetHeight measurement circular (grid -> cards -> grid). */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var hero    = document.querySelector('.hero');
  var fig     = document.querySelector('.hero__fig');
  var word    = document.querySelector('.hero__word');
  var eyebrow = document.querySelector('.hero__eyebrow');
  var meta    = document.querySelector('.hero__meta');
  var nav     = document.querySelector('.nav');
  var split   = document.querySelector('.split');
  var ticking = false;

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  /* Visible at the top, hidden while scrolling down, back on the way up.
     The old rule (top of page, or once .split reached the top) belonged to
     the pinned hero and left the nav missing for most of the page. */
  var lastY = 0;
  function updateNav() {
    if (!nav) return;
    var y = window.scrollY;
    var show = y <= 24 || y < lastY;
    /* ignore sub-pixel jitter, which otherwise flickers the bar */
    if (Math.abs(y - lastY) > 2) lastY = y;
    nav.classList.toggle('is-stuck', show);
  }

  function updateHero() {
    ticking = false;
    updateNav();
    if (!hero || !fig || reduce) return;
    var h = hero.offsetHeight || 1;
    var p = clamp(window.scrollY / (h * 0.85), 0, 1);
    fig.style.transform =
      'translateY(' + (p * -70) + 'px) scale(' + (1 - p * 0.22) + ')';
    if (word) {
      word.style.transform = 'translateY(' + (p * 50) + 'px)';
      word.style.opacity = String(1 - p * 0.9);
    }
    if (eyebrow) eyebrow.style.opacity = String(1 - p * 1.4);
    if (meta)    meta.style.opacity    = String(1 - p * 1.4);
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(updateHero); } }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  updateHero();

  /* ───────── GLASS HERO ─────────
     One class, .is-in, starts the card and the photograph together. It is
     added on the next frame after load rather than from CSS alone so the
     transition actually runs; a plain static style would paint the end
     state immediately and there would be no entrance.

     Everything is also behind an unconditional timer: rAF is throttled in
     background tabs and can be starved entirely in embedded viewers, and
     the entrance must never be the reason the hero stays invisible. */
  var glass = document.querySelector('.hero--glass');
  if (glass) {
    var shot = glass.querySelector('.hero__media');
    var seen = false;
    function enter() {
      if (seen) return;
      seen = true;
      glass.classList.add('is-in');
    }
    if (reduce) enter();
    else {
      var bg = new Image();
      bg.onload = bg.onerror = function () { requestAnimationFrame(enter); };
      /* read the URL the browser resolved rather than re-deriving it */
      var m = /url\(["']?(.*?)["']?\)/.exec(getComputedStyle(shot).backgroundImage);
      if (m && m[1]) bg.src = m[1]; else enter();
      setTimeout(enter, 1500);        // safety net, fires regardless
    }
  }

  /* care carousel — 3-up, centre card shows text, side cards full-bleed photo */
  var hd    = document.querySelector('.care__hd');
  var grid  = document.querySelector('.care__grid');
  if (hd && grid) {
    var cards  = Array.prototype.slice.call(grid.querySelectorAll('.cd'));
    var n      = cards.length;
    var active = 0;
    var timer  = null;

    function layout() {
      cards.forEach(function (c, i) {
        var d = (i - active + n) % n;         // 0 = centre
        var pos = d === 0 ? 0 : d === 1 ? 1 : d === n - 1 ? -1 : 9;
        c.setAttribute('data-pos', pos);
        c.setAttribute('aria-hidden', pos === 9 ? 'true' : 'false');
      });
      /* measure the CENTRE card at natural height, then pin every card.
         The CSS gives .cd height:100%, which resolves against this grid's
         height — so a plain offsetHeight sweep measures the grid, not the
         content, and the first call would lock the grid at 0px. Release
         the height, measure, then set it explicitly on all cards. */
      var centre = cards.filter(function (c) {
        return c.getAttribute('data-pos') === '0';
      })[0] || cards[0];
      centre.style.height = 'auto';
      var h = centre.offsetHeight;
      centre.style.height = '';
      if (!h) {                             // fallback: use the tallest card
        h = 0;
        cards.forEach(function (c) { h = Math.max(h, c.offsetHeight); });
      }
      cards.forEach(function (c) { c.style.height = h + 'px'; });
      grid.style.height = h + 'px';
    }

    /* photos load async and change the centre card's height — re-measure
       each time one arrives so the grid never clips a late-loading image */
    cards.forEach(function (c) {
      var img = c.querySelector('.cd__img');
      var src = img && img.getAttribute('data-img');
      if (src) { var p = new Image(); p.onload = layout; p.src = src; }
    });

    function go(step) {
      active = (active + step + n) % n;
      layout();
    }

    var ctl = document.createElement('div');
    ctl.className = 'care__nav';
    ctl.innerHTML =
      '<button type="button" class="care__btn" data-dir="-1" aria-label="Previous care card">&#8249;</button>' +
      '<button type="button" class="care__btn" data-dir="1" aria-label="Next care card">&#8250;</button>';
    hd.appendChild(ctl);
    ctl.addEventListener('click', function (ev) {
      var btn = ev.target.closest('.care__btn');
      if (!btn) return;
      go(Number(btn.getAttribute('data-dir')));
      restart();
    });

    // click a side card to bring it to the centre
    cards.forEach(function (c) {
      c.addEventListener('click', function () {
        var p = Number(c.getAttribute('data-pos'));
        if (p === 1 || p === -1) { go(p); restart(); }
      });
    });

    // swipe on touch
    var x0 = null;
    grid.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    grid.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { go(dx < 0 ? 1 : -1); restart(); }
      x0 = null;
    });

    // auto-rotate (off for reduced motion, paused on hover)
    function start() { if (!reduce) timer = setInterval(function () { go(1); }, 4500); }
    function stop()  { clearInterval(timer); }
    function restart() { stop(); start(); }
    grid.addEventListener('mouseenter', stop);
    grid.addEventListener('mouseleave', start);

    layout();
    addEventListener('resize', layout);
    addEventListener('load', layout);
    start();
  }

  /* scroll-scrubbed quote — words go pale → ink as the block crosses the screen */
  var scrub = document.querySelector('[data-scrub]');
  if (scrub) {
    var words = scrub.textContent.trim().split(/\s+/);
    scrub.setAttribute('aria-label', words.join(' '));
    scrub.innerHTML = words.map(function (w) {
      return '<span class="w" aria-hidden="true">' + w + '</span>';
    }).join(' ');
    var spans = scrub.querySelectorAll('.w');

    function scrubQuote() {
      if (reduce) { spans.forEach(function (s) { s.classList.add('on'); }); return; }
      var r = scrub.getBoundingClientRect(), vh = window.innerHeight;
      // 0 when the quote enters the lower 85% of the screen, 1 when it reaches 35%
      var p = clamp((vh * 0.85 - r.top) / (vh * 0.5), 0, 1);
      var lit = Math.round(p * spans.length);
      spans.forEach(function (s, i) { s.classList.toggle('on', i < lit); });
    }
    addEventListener('scroll', scrubQuote, { passive: true });
    addEventListener('resize', scrubQuote);
    scrubQuote();
  }

  /* FAQ accordion — one row open at a time */
  var fqs = document.querySelectorAll('.fq');
  fqs.forEach(function (fq) {
    var btn = fq.querySelector('.fq__q');
    btn.addEventListener('click', function () {
      var wasOpen = fq.classList.contains('is-open');
      fqs.forEach(function (o) {
        o.classList.remove('is-open');
        o.querySelector('.fq__q').setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        fq.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* testimonial arrows */
  var tTrack = document.querySelector('.tst__track');
  document.querySelectorAll('.tst__btn').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!tTrack) return;
      tTrack.scrollBy({
        left: Number(b.getAttribute('data-dir')) * tTrack.clientWidth * 0.6,
        behavior: reduce ? 'auto' : 'smooth'
      });
    });
  });

})();