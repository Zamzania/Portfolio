/* Praja Alim Zamzani — portfolio interactions.
   Vanilla JS + Lenis (smooth scroll). Every motion honours prefers-reduced-motion. */
(function () {
  'use strict';

  const body = document.body;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  /* ---------------------------------------------------------------
     Smooth scroll (Lenis)
  --------------------------------------------------------------- */
  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95 });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  const navH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
  function scrollToTarget(target) {
    if (lenis) lenis.scrollTo(target, { offset: target === 0 ? 0 : -navH() + 1, duration: 1.6 });
    else {
      const y = target === 0 ? 0 : target.getBoundingClientRect().top + window.scrollY - navH() + 1;
      window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
    }
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id === '#' || id === '#main') return;
    const target = id === '#top' ? 0 : document.querySelector(id);
    if (target === null) return;
    e.preventDefault();
    if (body.classList.contains('menu-open')) setMenu(false);
    scrollToTarget(target);
  });

  /* ---------------------------------------------------------------
     Split section titles into letters (words kept intact)
  --------------------------------------------------------------- */
  $$('[data-split]').forEach(el => {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.textContent = '';
    let i = 0;
    text.split(' ').forEach((word, wi, arr) => {
      const w = document.createElement('span');
      w.style.display = 'inline-block';
      w.style.whiteSpace = 'nowrap';
      w.setAttribute('aria-hidden', 'true');
      for (const ch of word) {
        const c = document.createElement('span');
        c.className = 'ch';
        c.style.setProperty('--i', i++);
        c.textContent = ch;
        w.appendChild(c);
      }
      el.appendChild(w);
      if (wi < arr.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });

  /* ---------------------------------------------------------------
     Opening sequence (once per session)
  --------------------------------------------------------------- */
  let seen = false;
  try { seen = sessionStorage.getItem('pz-intro') === '1'; } catch (e) { /* storage blocked */ }
  function ready() { body.classList.add('is-ready'); try { sessionStorage.setItem('pz-intro', '1'); } catch (e) {} }
  if (seen || reduced) {
    body.classList.add('skip-intro', 'is-done');
    requestAnimationFrame(() => requestAnimationFrame(ready));
  } else {
    if (lenis) lenis.stop();
    const t0 = performance.now();
    const fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    Promise.race([fonts, new Promise(r => setTimeout(r, 2400))]).then(() => {
      setTimeout(() => {
        ready();
        if (lenis) lenis.start();
        setTimeout(() => body.classList.add('is-done'), 1500);
      }, Math.max(0, 2500 - (performance.now() - t0)));
    });
  }

  /* ---------------------------------------------------------------
     Reveal on scroll + count-up
  --------------------------------------------------------------- */
  function countUp(el) {
    const target = parseFloat(el.dataset.count), dec = parseInt(el.dataset.decimals || '0', 10);
    if (reduced) { el.textContent = target.toFixed(dec); return; }
    const t0 = performance.now(), dur = 1800;
    (function tick(now) {
      const p = clamp((now - t0) / dur, 0, 1);
      el.textContent = (target * easeOut(p)).toFixed(dec);
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
  const io = new IntersectionObserver(entries => {
    let n = 0;
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      if (el.hasAttribute('data-reveal')) el.style.setProperty('--d', (n++ * 0.09).toFixed(2) + 's');
      el.classList.add('is-in');
      $$('.count', el).forEach(countUp);
      $$('.draw-on-view', el).forEach(d => d.classList.add('is-in'));
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('[data-reveal], [data-split], .title-underline.draw, .draw-on-view').forEach(el => io.observe(el));

  /* ---------------------------------------------------------------
     Navigation, progress, timeline, back-to-top
  --------------------------------------------------------------- */
  const nav = $('#nav');
  const prog = $('.progress span');
  const toTop = $('.to-top');
  const timeline = $('.timeline');
  const tlItems = $$('.tl-item');
  const links = $$('.nav-link');
  let lastY = window.scrollY, ticking = false;
  function onScroll() {
    const y = window.scrollY, vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    const p = max > 0 ? y / max : 0;
    prog.style.transform = `scaleX(${p})`;
    toTop.style.setProperty('--p', p.toFixed(3));
    toTop.classList.toggle('is-on', y > vh);
    nav.classList.toggle('scrolled', y > 40);
    if (!body.classList.contains('menu-open')) nav.classList.toggle('is-hidden', y > lastY + 2 && y > vh * 0.7);
    if (y < lastY - 2) nav.classList.remove('is-hidden');
    lastY = y;
    if (timeline) {
      const r = timeline.getBoundingClientRect();
      const line = vh * 0.6;
      timeline.style.setProperty('--p', clamp((line - r.top) / r.height, 0, 1).toFixed(4));
      tlItems.forEach(it => it.classList.toggle('is-lit', it.getBoundingClientRect().top + 44 < line));
    }
    ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => scrollToTarget(0));
  const footer = $('.footer');
  new IntersectionObserver(([e]) => toTop.classList.toggle('at-end', e.isIntersecting)).observe(footer);

  const secIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => secIO.observe(s));

  /* mobile menu */
  const burger = $('.burger'), menu = $('#menu');
  $$('#menu nav a').forEach((a, i) => a.style.setProperty('--i', i));
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    body.classList.toggle('menu-open', open);
    if (open) {
      menu.hidden = false; nav.classList.remove('is-hidden');
      requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('is-open')));
      if (lenis) lenis.stop(); else body.style.overflow = 'hidden';
      const s = $('.sig-menu', menu); s.classList.remove('is-drawing'); void s.getBoundingClientRect(); s.classList.add('is-drawing');
    } else {
      menu.classList.remove('is-open');
      if (lenis) lenis.start(); else body.style.overflow = '';
      setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, reduced ? 0 : 700);
    }
  }
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && body.classList.contains('menu-open')) setMenu(false); });

  /* ---------------------------------------------------------------
     Pointer: cursor, ripple, magnetic, spotlight, hero light
  --------------------------------------------------------------- */
  if (fine && !reduced) {
    body.classList.add('has-cursor');
    const cur = $('.cursor'), dot = $('.c-dot'), ring = $('.c-ring'), label = $('.c-label');
    let mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener('pointermove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      cur.classList.remove('is-out');
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => cur.classList.add('is-out'));
    (function loop() {
      rx = lerp(rx, mx, 0.16); ry = lerp(ry, my, 0.16);
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener('pointerover', e => {
      const t = e.target;
      const lab = t.closest('[data-cursor]');
      const link = t.closest('a, button, .coursework li, .skill-item, .language-item, .week > li, .keyword, .project-tags li');
      const text = t.closest('input, textarea');
      cur.classList.toggle('is-label', !!lab);
      label.textContent = lab ? lab.dataset.cursor : '';
      cur.classList.toggle('is-link', !lab && !!link);
      cur.classList.toggle('is-text', !!text);
    });
    window.addEventListener('pointerdown', e => {
      const r = document.createElement('span');
      r.className = 'ripple';
      r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px';
      body.appendChild(r);
      setTimeout(() => r.remove(), 950);
    });
    $$('.magnetic').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; el.style.transition = 'transform .8s cubic-bezier(.22,1,.36,1)'; setTimeout(() => { el.style.transition = ''; }, 800); });
    });
  }
  $$('.spot').forEach(el => el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));
  const hero = $('.hero');
  if (hero && fine) hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty('--lx', (e.clientX - r.left) + 'px');
    hero.style.setProperty('--ly', (e.clientY - r.top) + 'px');
  });

  /* ---------------------------------------------------------------
     Gold dust (idle ambience)
  --------------------------------------------------------------- */
  const dust = $('#dust');
  if (dust && !reduced) {
    const ctx = dust.getContext('2d');
    let W, H, dpr, parts = [], pmx = -9999, pmy = -9999, running = true;
    function make(initial) {
      return {
        x: Math.random() * W, y: initial ? Math.random() * H : H + 10 * dpr,
        r: (Math.random() ** 2 * 1.5 + 0.35) * dpr,
        vy: -(Math.random() * 0.18 + 0.04) * dpr, vx: (Math.random() - 0.5) * 0.08 * dpr,
        ph: Math.random() * Math.PI * 2, sp: Math.random() * 0.02 + 0.006, ox: 0, oy: 0
      };
    }
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = dust.width = Math.round(innerWidth * dpr); H = dust.height = Math.round(innerHeight * dpr);
      const n = Math.min(70, Math.round(innerWidth * innerHeight / 22000));
      parts = Array.from({ length: n }, () => make(true));
    }
    size();
    window.addEventListener('resize', size);
    window.addEventListener('pointermove', e => { pmx = e.clientX * dpr; pmy = e.clientY * dpr; }, { passive: true });
    document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) requestAnimationFrame(frame); });
    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        p.ph += p.sp;
        p.x += p.vx + Math.sin(p.ph) * 0.12 * dpr; p.y += p.vy;
        const dx = p.x - pmx, dy = p.y - pmy, d2 = dx * dx + dy * dy, R = 140 * dpr;
        if (d2 < R * R) { const f = (1 - Math.sqrt(d2) / R) * 1.6; p.ox += dx / Math.sqrt(d2 + 1) * f; p.oy += dy / Math.sqrt(d2 + 1) * f; }
        p.ox *= 0.94; p.oy *= 0.94;
        if (p.y < -10 * dpr) Object.assign(p, make(false));
        if (p.x < -10) p.x = W + 5; if (p.x > W + 10) p.x = -5;
        const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(p.ph * 2.3));
        const x = p.x + p.ox, y = p.y + p.oy;
        const big = p.r > 1.25 * dpr;
        ctx.globalAlpha = tw * (big ? 0.8 : 0.5);
        if (big) {
          const g = ctx.createRadialGradient(x, y, 0, x, y, p.r * 4);
          g.addColorStop(0, 'rgba(246, 231, 189, 1)'); g.addColorStop(.25, 'rgba(232, 213, 163, .45)'); g.addColorStop(1, 'rgba(201, 169, 98, 0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, p.r * 4, 0, Math.PI * 2); ctx.fill();
        } else {
          ctx.fillStyle = '#D9BE84'; ctx.beginPath(); ctx.arc(x, y, p.r, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------------------------------------------------------------
     Certificates: fit, filter, tilt, lightbox
  --------------------------------------------------------------- */
  $$('.cert-thumb img').forEach(img => {
    const set = () => {
      img.parentElement.style.setProperty('--bg', `url("${img.src}")`);
      const r = img.naturalWidth / img.naturalHeight;
      if (r > 1.55 || r < 1.2) img.classList.add('fit');
    };
    img.complete && img.naturalWidth ? set() : img.addEventListener('load', set, { once: true });
  });

  const filters = $('.filters'), fline = $('.filter-fill'), certs = $$('.cert');
  function placeLine(btn) {
    if (!btn) return;
    fline.style.width = btn.offsetWidth + 'px';
    fline.style.height = btn.offsetHeight + 'px';
    fline.style.transform = `translate(${btn.offsetLeft}px, ${btn.offsetTop}px)`;
    if (filters.scrollWidth > filters.clientWidth) filters.scrollTo({ left: btn.offsetLeft - 20, behavior: reduced ? 'auto' : 'smooth' });
  }
  if (filters) {
    const btns = $$('button', filters);
    btns.forEach(btn => btn.addEventListener('click', () => {
      btns.forEach(b => b.setAttribute('aria-selected', String(b === btn)));
      placeLine(btn);
      const f = btn.dataset.filter;
      certs.forEach(c => {
        const show = f === 'all' || c.dataset.cat === f;
        if (show) { c.classList.remove('is-gone'); c.classList.add('is-in'); requestAnimationFrame(() => requestAnimationFrame(() => c.classList.remove('is-out'))); }
        else { c.classList.add('is-out'); setTimeout(() => { if (c.classList.contains('is-out')) c.classList.add('is-gone'); }, reduced ? 0 : 450); }
      });
    }));
    const place = () => placeLine($('[aria-selected="true"]', filters));
    window.addEventListener('resize', place);
    if (document.fonts) document.fonts.ready.then(place);
    place();
  }

  if (fine && !reduced) $$('.certificate-card').forEach(card => {
    const th = $('.cert-thumb', card), gl = $('.glare', card);
    card.addEventListener('pointermove', e => {
      const r = th.getBoundingClientRect();
      const px = clamp((e.clientX - r.left) / r.width, 0, 1), py = clamp((e.clientY - r.top) / r.height, 0, 1);
      th.style.transform = `rotateY(${(px - 0.5) * 10}deg) rotateX(${(0.5 - py) * 8}deg)`;
      gl.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
      gl.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
    });
    card.addEventListener('pointerleave', () => { th.style.transform = ''; });
  });

  const lb = $('#lightbox'), lbImg = $('#lbImg'), lbTitle = $('#lbTitle'), lbMeta = $('#lbMeta'), lbPdf = $('#lbPdf');
  let lbi = 0;
  const visible = () => $$('.cert:not(.is-gone) .certificate-card');
  function show(card, swap) {
    const apply = () => {
      lbImg.src = card.dataset.img; lbImg.alt = 'Certificate: ' + card.dataset.title;
      lbTitle.textContent = card.dataset.title; lbMeta.textContent = card.dataset.meta; lbPdf.href = card.dataset.pdf;
    };
    if (swap && !reduced) {
      lbImg.classList.add('is-swap');
      setTimeout(() => { apply(); const done = () => lbImg.classList.remove('is-swap'); lbImg.complete ? done() : (lbImg.onload = done); }, 260);
    } else apply();
  }
  $$('.certificate-card').forEach(card => card.addEventListener('click', () => {
    lbi = visible().indexOf(card);
    show(card, false);
    if (typeof lb.showModal === 'function') { lb.showModal(); if (lenis) lenis.stop(); }
    else window.open(card.dataset.pdf, '_blank');
  }));
  function step(d) { const v = visible(); if (!v.length) return; lbi = (lbi + d + v.length) % v.length; show(v[lbi], true); }
  $('.lb-prev').addEventListener('click', () => step(-1));
  $('.lb-next').addEventListener('click', () => step(1));
  $('.lb-close').addEventListener('click', () => lb.close());
  lb.addEventListener('close', () => { if (lenis) lenis.start(); });
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1); });
  let sx = 0;
  lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); });

  /* ---------------------------------------------------------------
     Schedule: watch, zones, weekly classes. Edit SCHEDULE below.
  --------------------------------------------------------------- */
  // day: 1 = Monday ... 5 = Friday. Times in WITA (Mataram, UTC+8).
  const SCHEDULE = [
    { day: 1, start: '15:20', end: '17:50', name: 'Kajian Migrasi dan Diaspora Internasional (A)', lecturer: 'Heavy Nala Estriani, M.Hub.Int.' },
    { day: 2, start: '07:00', end: '09:30', name: 'Masalah-Masalah Negara Berkembang (A)', lecturer: 'Mala Mardalina, S.P., MA.' },
    { day: 3, start: '07:00', end: '09:30', name: 'Keamanan dan Perdamaian di Asia Tenggara (B)', lecturer: 'Ahmad Mubarak Munir, S.IP., MA.' },
    { day: 3, start: '07:00', end: '09:30', name: 'Perusahaan Multinasional dan Kebijakan Investasi Asing (A)', lecturer: 'Hasbi Asyidiqi, S.Sos., M.Si.' },
    { day: 4, start: '07:00', end: '09:30', name: 'Filantropi dan Bantuan Internasional (A)', lecturer: 'Sirwan Yazid Bustami, S.I.P., M.A.' },
    { day: 5, start: '15:20', end: '17:50', name: 'Ekonomi dan Perdagangan Internasional di Asia Tenggara (B)', lecturer: 'Sirwan Yazid Bustami, S.I.P., M.A.' }
  ];
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const ZONES = { 7: 'WIB · UTC+7', 8: 'WITA · UTC+8', 9: 'WIT · UTC+9' };
  const pad = v => String(v).padStart(2, '0');
  const toMin = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
  const at = off => { const d = new Date(Date.now() + off * 3600e3); return { h: d.getUTCHours(), m: d.getUTCMinutes(), s: d.getUTCSeconds(), ms: d.getUTCMilliseconds(), day: d.getUTCDay(), date: d.getUTCDate() }; };

  const week = $('#week');
  for (let d = 1; d <= 5; d++) {
    const li = document.createElement('li');
    li.dataset.day = d;
    li.innerHTML = `<span class="week-day"><b>${DAYS[d].slice(0, 3)}</b><small>${DAYS[d]}</small></span><div class="week-classes">${SCHEDULE.map((c, i) => c.day === d
      ? `<div class="class" data-i="${i}"><h4>${c.name}</h4><p><time>${c.start} – ${c.end}</time>${c.lecturer}</p></div>` : '').join('')}</div>`;
    week.appendChild(li);
  }

  let zone = 8, shown = 8;
  $$('.timezone-btn').forEach(b => b.addEventListener('click', () => {
    zone = Number(b.dataset.zone);
    $$('.timezone-btn').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    $('#dialZone').textContent = ZONES[zone];
    if (reduced) shown = zone;
  }));

  const hH = $('#handHour'), hM = $('#handMin'), hS = $('#handSec'), dig = $('#digTime'), digSec = $('#digSec'), clockDate = $('#clockDate'), dateEl = $('#watchDate');
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const status = $('#status'), statusText = $('#statusText');
  let lastSec = -1;
  function watchFrame() {
    shown = reduced ? zone : lerp(shown, zone, 0.06);
    if (Math.abs(shown - zone) < 0.001) shown = zone;
    const t = at(shown);
    const sec = t.s + (reduced ? 0 : t.ms / 1000);
    hS.setAttribute('transform', `rotate(${sec * 6} 100 100)`);
    hM.setAttribute('transform', `rotate(${(t.m + sec / 60) * 6} 100 100)`);
    hH.setAttribute('transform', `rotate(${((t.h % 12) + t.m / 60 + sec / 3600) * 30} 100 100)`);
    if (t.s !== lastSec) {
      lastSec = t.s;
      const z = at(zone);
      dig.innerHTML = `${pad(z.h)}<span class="colon">:</span>${pad(z.m)}`;
      digSec.textContent = pad(z.s);
      if (dateEl) dateEl.textContent = z.date;
      const zd = new Date(Date.now() + zone * 3600e3);
      clockDate.textContent = `${DAYS[zd.getUTCDay()]}, ${zd.getUTCDate()} ${MONTHS[zd.getUTCMonth()]} ${zd.getUTCFullYear()}`;
      const w = at(8), now = w.h * 60 + w.m;
      const today = SCHEDULE.filter(c => c.day === w.day);
      const cur = today.find(c => now >= toMin(c.start) && now < toMin(c.end));
      const next = today.filter(c => toMin(c.start) > now).sort((a, b) => toMin(a.start) - toMin(b.start))[0];
      let txt;
      if (cur) txt = `In class until ${cur.end} WITA`;
      else if (next) txt = `Available · next class ${next.start} WITA`;
      else if (w.day === 0 || w.day === 6) txt = 'Weekend · messages welcome';
      else txt = 'Available · classes done today';
      if (statusText.textContent !== txt) statusText.textContent = txt;
      status.classList.toggle('is-busy', !!cur);
      $$('.week > li').forEach(li => li.classList.toggle('is-today', Number(li.dataset.day) === w.day));
      $$('.class').forEach(el => { const c = SCHEDULE[el.dataset.i]; el.classList.toggle('is-now', c.day === w.day && now >= toMin(c.start) && now < toMin(c.end)); });
    }
  }
  if (reduced) { watchFrame(); setInterval(watchFrame, 1000); }
  else (function loop() { watchFrame(); requestAnimationFrame(loop); })();

  /* ---------------------------------------------------------------
     Contact: copy, toast, compose
  --------------------------------------------------------------- */
  const toast = $('#toast');
  let tt;
  function say(msg) { toast.textContent = msg; toast.classList.add('is-on'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('is-on'), 2600); }
  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise((res, rej) => {
      const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      body.appendChild(ta); ta.select();
      try { document.execCommand('copy') ? res() : rej(); } catch (e) { rej(e); }
      ta.remove();
    });
  }
  $$('[data-copy]').forEach(b => b.addEventListener('click', () => copy(b.dataset.copy).then(() => say(b.dataset.toast || 'Copied')).catch(() => say('Copy failed, please copy manually'))));

  const form = $('#contactForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const err = $('#formError');
    const f = { name: form.name, email: form.email, subject: form.subject, message: form.message };
    $$('.form-group', form).forEach(x => x.classList.remove('has-error'));
    let bad = null;
    if (!f.name.value.trim()) bad = [f.name, 'Please add your name.'];
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())) bad = [f.email, 'Please enter a valid email address so I can reply.'];
    else if (!f.subject.value.trim()) bad = [f.subject, 'Please add a short subject.'];
    else if (!f.message.value.trim()) bad = [f.message, 'Please write a message before sending.'];
    if (bad) { bad[0].closest('.form-group').classList.add('has-error'); err.textContent = bad[1]; bad[0].focus(); return; }
    err.textContent = '';
    const text = `${f.message.value.trim()}\n\n${f.name.value.trim()}\n${f.email.value.trim()}`;
    say('Opening your email app');
    window.location.href = `mailto:praja.zamzania@gmail.com?subject=${encodeURIComponent('Portfolio: ' + f.subject.value.trim())}&body=${encodeURIComponent(text)}`;
  });

  $('#year').textContent = new Date().getFullYear();
})();
