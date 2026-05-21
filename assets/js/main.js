/* =================================================================
   Taha Kommah — Portfolio interactions
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

    var p = 0;
    var timer = setInterval(function () {
      p += Math.random() * 16 + 6;
      if (p >= 100) { p = 100; clearInterval(timer); finish(); }
      bar.style.width = p + '%';
      pct.textContent = Math.floor(p) + '%';
    }, 130);

    function finish() {
      setTimeout(function () {
        el.classList.add('done');
        document.body.style.overflow = '';
      }, 400);
    }
    document.body.style.overflow = 'hidden';
    // Safety release
    window.addEventListener('load', function () {
      setTimeout(function () {
        el.classList.add('done');
        document.body.style.overflow = '';
      }, 2600);
    });
  })();

  /* ---------------------------------------------------------------
     CUSTOM CURSOR
     --------------------------------------------------------------- */
  (function cursor() {
    var dot  = $('#cursorDot');
    var ring = $('#cursorRing');
    if (!dot || !ring || window.matchMedia('(max-width:900px)').matches) return;

    var mx = 0, my = 0, rx = 0, ry = 0;

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    });

    (function follow() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(follow);
    })();

    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a, button, [data-cursor]')) ring.classList.add('is-hover');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest('a, button, [data-cursor]')) ring.classList.remove('is-hover');
    });
    window.addEventListener('mousedown', function () { ring.classList.add('is-hover'); });
    window.addEventListener('mouseup',   function () { ring.classList.remove('is-hover'); });
  })();

  /* ---------------------------------------------------------------
     SAKURA PETALS
     --------------------------------------------------------------- */
  (function petals() {
    var canvas = $('#petals');
    if (!canvas || reduceMotion) return;
    var ctx = canvas.getContext('2d');
    var w, h, list = [];

    function size() {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    size();
    window.addEventListener('resize', size);

    var colors = ['#ff8fd0', '#ff5fc8', '#43e8ff', '#9b6bff'];
    var count  = Math.min(34, Math.floor(window.innerWidth / 38));

    function Petal() { this.reset(true); }
    Petal.prototype.reset = function (init) {
      this.x = Math.random() * w;
      this.y = init ? Math.random() * h : -20;
      this.r = Math.random() * 6 + 4;
      this.sp = Math.random() * 0.9 + 0.4;
      this.sway = Math.random() * 1.4 + 0.5;
      this.ang = Math.random() * Math.PI * 2;
      this.spin = (Math.random() - 0.5) * 0.04;
      this.color = colors[(Math.random() * colors.length) | 0];
      this.alpha = Math.random() * 0.45 + 0.25;
    };
    Petal.prototype.step = function () {
      this.y += this.sp;
      this.ang += this.spin;
      this.x += Math.sin(this.y / 55) * this.sway * 0.3;
      if (this.y > h + 24) this.reset(false);
    };
    Petal.prototype.draw = function () {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.ang);
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, this.r, this.r * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    for (var i = 0; i < count; i++) list.push(new Petal());

    (function loop() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < list.length; i++) { list[i].step(); list[i].draw(); }
      requestAnimationFrame(loop);
    })();
  })();

  /* ---------------------------------------------------------------
     NAV — scrolled state, burger, active link
     --------------------------------------------------------------- */
  (function nav() {
    var bar    = $('#nav');
    var burger = $('#navBurger');
    var links  = $('#navLinks');

    function onScroll() {
      bar.classList.toggle('scrolled', window.scrollY > 40);
    }
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

    // active link via section observation
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
    var pbar  = $('#scrollProgress');
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
     HERO — typing effect
     --------------------------------------------------------------- */
  (function typing() {
    var el = $('#roleType');
    if (!el) return;
    var words = [
      'scalable web platforms.',
      'high-performance APIs.',
      'distributed systems.',
      'microservices that scale.',
      'fast, reliable backends.'
    ];
    if (reduceMotion) { el.textContent = words[0]; return; }

    var wi = 0, ci = 0, deleting = false;

    function tick() {
      var word = words[wi];
      ci += deleting ? -1 : 1;
      el.textContent = word.slice(0, ci);

      var delay = deleting ? 45 : 85;
      if (!deleting && ci === word.length) { delay = 1700; deleting = true; }
      else if (deleting && ci === 0) {
        deleting = false; wi = (wi + 1) % words.length; delay = 350;
      }
      setTimeout(tick, delay);
    }
    setTimeout(tick, 900);
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
        t.style.transitionDelay = Math.min(idx * 0.09, 0.5) + 's';
        t.classList.add('visible');
        io.unobserve(t);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (i) { io.observe(i); });
  })();

  /* ---------------------------------------------------------------
     COUNTERS
     --------------------------------------------------------------- */
  (function counters() {
    var nums = $$('.stat__num');
    if (!nums.length) return;

    function run(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var decimal = target % 1 !== 0;
      var dur = 1700, start = null;

      function frame(ts) {
        if (!start) start = ts;
        var prog = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - prog, 3);
        var val = target * eased;
        el.textContent = (decimal ? val.toFixed(1) : Math.floor(val)) + suffix;
        if (prog < 1) requestAnimationFrame(frame);
        else el.textContent = (decimal ? target.toFixed(1) : target) + suffix;
      }
      requestAnimationFrame(frame);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { io.observe(n); });
  })();

  /* ---------------------------------------------------------------
     POWER BARS
     --------------------------------------------------------------- */
  (function powerbars() {
    var bars = $$('.powerbar');
    if (!bars.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('lit'); io.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    bars.forEach(function (b) { io.observe(b); });
  })();

  /* ---------------------------------------------------------------
     CARD TILT (subtle, desktop only)
     --------------------------------------------------------------- */
  (function tilt() {
    if (reduceMotion || window.matchMedia('(max-width:900px)').matches) return;
    $$('.skill-card, .proj, .about__card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          'perspective(800px) rotateY(' + (px * 5) + 'deg) rotateX(' +
          (-py * 5) + 'deg) translateY(-6px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  })();

  /* ---------------------------------------------------------------
     YEAR
     --------------------------------------------------------------- */
  var yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();

})();
