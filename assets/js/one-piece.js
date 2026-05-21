/* =================================================================
   Taha Kommah — Portfolio · One Piece Edition — interactions
   ================================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------------
     LOADER
     --------------------------------------------------------------- */
  (function loader() {
    var el  = $('#loader');
    var bar = $('#loaderBar');
    var pct = $('#loaderPct');
    if (!el) return;
    document.body.style.overflow = 'hidden';

    var p = 0;
    var timer = setInterval(function () {
      p += Math.random() * 15 + 7;
      if (p >= 100) { p = 100; clearInterval(timer); release(420); }
      bar.style.width = p + '%';
      pct.textContent = Math.floor(p) + '%';
    }, 135);

    function release(delay) {
      setTimeout(function () {
        el.classList.add('done');
        document.body.style.overflow = '';
      }, delay);
    }
    window.addEventListener('load', function () { release(2600); });
  })();

  /* ---------------------------------------------------------------
     CUSTOM CURSOR
     --------------------------------------------------------------- */
  (function cursor() {
    var c = $('#cursor');
    if (!c || window.matchMedia('(max-width:900px)').matches) return;

    var x = 0, y = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', function (e) { x = e.clientX; y = e.clientY; });

    (function follow() {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      c.style.left = cx + 'px';
      c.style.top  = cy + 'px';
      requestAnimationFrame(follow);
    })();

    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a, button, [data-cursor]')) c.classList.add('is-hover');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest('a, button, [data-cursor]')) c.classList.remove('is-hover');
    });
  })();

  /* ---------------------------------------------------------------
     FALLING GOLD COINS
     --------------------------------------------------------------- */
  (function coins() {
    var canvas = $('#coins');
    if (!canvas || reduceMotion) return;
    var ctx = canvas.getContext('2d');
    var w, h, list = [];

    function size() {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    size();
    window.addEventListener('resize', size);

    var count = Math.min(26, Math.floor(window.innerWidth / 52));

    function Coin() { this.reset(true); }
    Coin.prototype.reset = function (init) {
      this.x = Math.random() * w;
      this.y = init ? Math.random() * h : -30;
      this.r = Math.random() * 7 + 6;
      this.sp = Math.random() * 1.1 + 0.5;
      this.drift = (Math.random() - 0.5) * 0.7;
      this.phase = Math.random() * Math.PI * 2;
      this.flip = Math.random() * 0.06 + 0.03;
      this.alpha = Math.random() * 0.4 + 0.35;
    };
    Coin.prototype.step = function () {
      this.y += this.sp;
      this.x += this.drift;
      this.phase += this.flip;
      if (this.y > h + 30) this.reset(false);
    };
    Coin.prototype.draw = function () {
      var sx = Math.abs(Math.cos(this.phase));
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.scale(sx < 0.12 ? 0.12 : sx, 1);
      ctx.beginPath();
      ctx.arc(0, 0, this.r, 0, Math.PI * 2);
      var g = ctx.createLinearGradient(-this.r, -this.r, this.r, this.r);
      g.addColorStop(0, '#f6cf57');
      g.addColorStop(0.5, '#e6a92a');
      g.addColorStop(1, '#b07d12');
      ctx.fillStyle = g;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(230,169,42,.7)';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(176,125,18,.9)';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(0, 0, this.r * 0.62, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };

    for (var i = 0; i < count; i++) list.push(new Coin());

    (function loop() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < list.length; i++) { list[i].step(); list[i].draw(); }
      requestAnimationFrame(loop);
    })();
  })();

  /* ---------------------------------------------------------------
     NAV
     --------------------------------------------------------------- */
  (function nav() {
    var bar    = $('#nav');
    var burger = $('#burger');
    var links  = $('#navLinks');

    function onScroll() { bar.classList.toggle('scrolled', window.scrollY > 40); }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (burger && links) {
      burger.addEventListener('click', function () {
        burger.classList.toggle('open');
        links.classList.toggle('open');
      });
      $$('#navLinks a').forEach(function (a) {
        a.addEventListener('click', function () {
          burger.classList.remove('open');
          links.classList.remove('open');
        });
      });
    }

    var map = {};
    $$('#navLinks a[href^="#"]').forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      if (id) map[id] = a;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          Object.keys(map).forEach(function (k) { map[k].classList.remove('active'); });
          if (map[en.target.id]) map[en.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (k) {
      var sec = document.getElementById(k);
      if (sec) spy.observe(sec);
    });
  })();

  /* ---------------------------------------------------------------
     SCROLL PROGRESS + BACK TO TOP
     --------------------------------------------------------------- */
  (function progress() {
    var pbar  = $('#voyageBar');
    var toTop = $('#toTop');

    function onScroll() {
      var st = window.scrollY;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? st / max : 0;
      if (pbar) pbar.style.width = (ratio * 100) + '%';
      if (toTop) toTop.classList.toggle('show', st > 600);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (toTop) {
      toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    }
  })();

  /* ---------------------------------------------------------------
     REVEAL ON SCROLL
     --------------------------------------------------------------- */
  (function reveal() {
    var items = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (i) { i.classList.add('visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var t = en.target;
        var sibs = Array.prototype.slice.call(t.parentNode.children)
          .filter(function (c) { return c.classList.contains('reveal'); });
        var idx = sibs.indexOf(t);
        t.style.transitionDelay = Math.min(idx * 0.1, 0.55) + 's';
        t.classList.add('visible');
        io.unobserve(t);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (i) { io.observe(i); });
  })();

  /* ---------------------------------------------------------------
     COUNTERS  (pirate stats + bounty)
     --------------------------------------------------------------- */
  (function counters() {
    var nums = $$('[data-count]');
    if (!nums.length) return;

    function run(el) {
      var target  = parseFloat(el.getAttribute('data-count'));
      var suffix  = el.getAttribute('data-suffix') || '';
      var decimal = target % 1 !== 0;
      var big     = target >= 1000;
      var dur = 2000, start = null;

      function fmt(v) {
        if (decimal) return v.toFixed(1);
        if (big) return Math.floor(v).toLocaleString('en-US');
        return Math.floor(v);
      }
      function frame(ts) {
        if (!start) start = ts;
        var prog = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - prog, 3);
        el.textContent = fmt(target * eased) + suffix;
        if (prog < 1) requestAnimationFrame(frame);
        else el.textContent = (decimal ? target.toFixed(1)
              : big ? target.toLocaleString('en-US') : target) + suffix;
      }
      requestAnimationFrame(frame);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.45 });
    nums.forEach(function (n) { io.observe(n); });
  })();

  /* ---------------------------------------------------------------
     HAKI BARS
     --------------------------------------------------------------- */
  (function haki() {
    var bars = $$('.haki__bar');
    if (!bars.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('lit'); io.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    bars.forEach(function (b) { io.observe(b); });
  })();

  /* ---------------------------------------------------------------
     YEAR
     --------------------------------------------------------------- */
  var yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();

})();
