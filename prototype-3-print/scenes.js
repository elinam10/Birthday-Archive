/* =========================================================================
   SCENES — построение и таймлайн всех 10 кадров
   ========================================================================= */

const C = window.CONTENT;
const NS = 'http://www.w3.org/2000/svg';
const ns = (t, a) => {
  const n = document.createElementNS(NS, t);
  if (a) for (const k in a) n.setAttribute(k, a[k]);
  return n;
};

/* ---------- общие мелкие конструкторы ---------- */

function head(title, opts) {
  const o = opts || {};
  const h = el('div', 'sc-head');
  const left = el('div');
  const t = el('h1', 'sc-title rv' + (o.sm ? ' sm' : ''), title);
  left.appendChild(t);
  let sub = null;
  if (o.sub) { sub = el('div', 'sc-sub rv', o.sub); left.appendChild(sub); }
  h.appendChild(left);
  let quote = null;
  if (o.quote) {
    quote = el('div', 'sc-quote rv');
    o.quote.forEach(l => quote.appendChild(el('div', null, l)));
    h.appendChild(quote);
  }
  const rule = el('div', 'sc-rule');
  return { node: h, rule, t, sub, quote };
}

function list(items, cls) {
  const ul = el('ul', cls);
  items.forEach(i => ul.appendChild(el('li', null, i)));
  return ul;
}

/* динозаврик — пиксельный силуэт, «менее ярко» и мельче по ТЗ */
function dinoNode(note) {
  const d = el('div', 'dino');
  const svg = ns('svg', { viewBox: '0 0 60 50' });
  const R = [
    [2, 22, 14, 8], [14, 20, 26, 18], [34, 12, 10, 12], [38, 4, 16, 12],
    [52, 10, 6, 4], [18, 38, 6, 10], [18, 46, 10, 3], [28, 38, 6, 8],
    [28, 44, 10, 3], [36, 26, 7, 3]
  ];
  R.forEach(r => svg.appendChild(ns('rect', { x: r[0], y: r[1], width: r[2], height: r[3], fill: 'currentColor' })));
  svg.appendChild(ns('rect', { x: 46, y: 7, width: 3, height: 3, fill: '#030d07' }));
  d.appendChild(svg);
  const course = el('div', 'dino-course');
  for (let i = 0; i < 4; i++) course.appendChild(el('i', null, '🌵'));
  d.appendChild(course);
  d.appendChild(el('div', 'dino-note', note));
  d.appendChild(el('div', 'ground'));
  return d;
}

/* ---------- коллаж для блока FRIENDSHIP ---------- */
function collageSlot(base, n, title) {
  const box = el('div', 'photo has-img');
  const grid = el('div', 's5-collage');
  for (let i = 1; i <= n; i++) {
    const cell = el('div');
    const cfg = { src: base + '-' + i + '.jpg', title: title + ' ' + i, label: 'PHOTO ' + i };
    const img = el('img');
    img.alt = cfg.title;
    img.addEventListener('error', () => { img.remove(); cell.classList.add('miss'); });
    img.src = cfg.src;
    const ph = el('div', 'ph', 'PHOTO ' + i);
    cell.append(img, ph);
    cell.addEventListener('click', e => { e.stopPropagation(); openWin(cfg); });
    grid.appendChild(cell);
  }
  box.appendChild(grid);
  return box;
}

/* ---------- синий человечек Optimus Poker (запасной вектор) ---------- */
function optimusLogo(src) {
  const w = el('div', 's5-logo');
  const img = el('img');
  img.alt = 'Optimus Poker';
  img.addEventListener('error', () => {
    img.remove();
    const svg = ns('svg', { viewBox: '0 0 40 40' });
    svg.appendChild(ns('circle', { cx: 20, cy: 12, r: 7, fill: 'var(--blue)' }));
    const p = ns('path', { d: 'M6 38c0-8 6.3-13 14-13s14 5 14 13z', fill: 'var(--blue)' });
    svg.appendChild(p);
    w.appendChild(svg);
  });
  img.src = src;
  w.appendChild(img);
  return w;
}

/* =========================================================================
   КАДР 1
   ========================================================================= */
const SC1 = {
  hud: C.s1.boot,
  build(root) {
    root.className = 'scene s-boot';
    const term = el('div', 'term');
    const lines = C.s1.lines.map(() => {
      const d = el('div', 'ln');
      term.appendChild(d);
      return d;
    });
    const load = el('div', 's1-load');
    const lbl = el('div', 'dim rv', C.s1.loadLabel);
    const bar = makeBar('', 44);
    load.append(lbl, bar);
    root.append(term, load);
    return { lines, bar, lbl, load };
  },
  async play(ctx, r) {
    E.typingSound = true;
    E.typingProfile = 0;
    for (let i = 0; i < C.s1.lines.length; i++) {
      const L = C.s1.lines[i];
      await typeVerdict(ctx, r.lines[i], L.t, L.v);
      await ctx.wait(L.v === 'DENIED' ? 560 : 170);
    }
    await ctx.wait(320);
    show(r.load);
    show(r.lbl);
    await ctx.wait(260);
    await runBar(ctx, r.bar, C.s1.loadTo, 2300);
    await ctx.wait(1100);
    E.typingSound = false;
  }
};

/* =========================================================================
   КАДР 2
   ========================================================================= */
const SC2 = {
  hud: C.s2.boot,
  build(root) {
    root.className = 'scene s-boot';
    const term = el('div', 'term');
    const broken = el('div', 'ln');
    term.appendChild(broken);
    const lines = C.s2.lines.map(() => { const d = el('div', 'ln'); term.appendChild(d); return d; });
    const observer = el('div', 's2-observer');
    term.appendChild(observer);
    const lines2 = C.s2.lines2.map(() => { const d = el('div', 'ln'); term.appendChild(d); return d; });
    const mission = el('div', 's2-mission');
    term.appendChild(mission);
    const lines3 = C.s2.lines3.map(() => { const d = el('div', 'ln'); term.appendChild(d); return d; });
    const prompt = el('div', 'ln');
    term.appendChild(prompt);
    const warn = el('div', 's2-warn rv');
    warn.appendChild(el('span', null, '[ ! ] ' + C.s2.warn));
    root.append(term, warn);
    return { broken, lines, observer, lines2, mission, lines3, prompt, warn };
  },
  async play(ctx, r) {
    E.typingSound = true;
    E.deniedAlert = true;
    E.typingProfile = 0;
    await typeVerdict(ctx, r.broken, C.s2.broken, 'DENIED');
    await ctx.wait(700);
    /* «чиним» строку */
    for (let i = 0; i < 6; i++) { r.broken.style.opacity = i % 2 ? '.12' : '1'; await ctx.wait(95); }
    r.broken.style.opacity = '1';
    r.broken.textContent = '';
    await typeVerdict(ctx, r.broken, C.s2.fixed, 'ACCEPTED');
    await ctx.wait(430);

    for (let i = 0; i < C.s2.lines.length; i++) {
      await type(ctx, r.lines[i], '> ' + C.s2.lines[i], 62);
      await ctx.wait(150);
    }
    await ctx.wait(420);
    await type(ctx, r.observer, C.s2.observer, 22);
    await ctx.wait(320);
    for (let i = 0; i < C.s2.lines2.length; i++) {
      await type(ctx, r.lines2[i], '> ' + C.s2.lines2[i], 62);
      await ctx.wait(140);
    }
    await type(ctx, r.mission, C.s2.mission, 26);
    r.mission.classList.add('flash');
    await ctx.wait(900);
    for (let i = 0; i < C.s2.lines3.length; i++) {
      await type(ctx, r.lines3[i], '> ' + C.s2.lines3[i], 55);
      await ctx.wait(160);
    }
    show(r.warn);
    await type(ctx, r.prompt, '> ' + C.s2.prompt, 40);
    r.prompt.appendChild(el('span', 'caret'));
    await ctx.wait(1400);
    E.typingSound = false;
    E.deniedAlert = false;
  }
};

/* =========================================================================
   КАДР 3
   ========================================================================= */
const SC3 = {
  hud: C.s3.boot,
  build(root) {
    root.className = 'scene';
    const grid = el('div', 's3-grid');

    const left = el('div');
    const rows = el('div', 's3-rows');
    const rowNodes = C.s3.rows.map(() => {
      const d = el('div', 'ln');
      const k = el('span', 'k');
      const v = el('span', 'v');
      d.append(k, v);
      rows.appendChild(d);
      return { k, v };
    });
    const sys = el('div', 's3-sys');
    const sysNodes = C.s3.sysLines.map(() => { const d = el('div'); sys.appendChild(d); return d; });
    const alert = el('div', 's3-alert', C.s3.alert);
    left.append(rows, sys, alert);

    const right = el('div');
    const scanbox = el('div', 'scanbox rv');
    const photo = photoSlot(C.s3.photo, 's3-photo');
    scanbox.append(photo, el('div', 'scanline'));
    const cap = el('div', 's3-cap rv', C.s3.scanCaption);
    right.append(scanbox, cap);

    grid.append(left, right);
    const dino = dinoNode(C.s3.dinoNote);
    root.append(grid, dino);
    return { rowNodes, sysNodes, alert, scanbox, cap, dino };
  },
  async play(ctx, r) {
    show(r.dino);
    E.typingSound = true;
    E.typingProfile = 0;
    for (let i = 0; i < C.s3.rows.length; i++) {
      const [k, v] = C.s3.rows[i];
      await type(ctx, r.rowNodes[i].k, k + ': ', 90);
      await type(ctx, r.rowNodes[i].v, v, 55);
      await ctx.wait(170);
    }
    await ctx.wait(340);
    for (let i = 0; i < C.s3.sysLines.length; i++) {
      await type(ctx, r.sysNodes[i], '> ' + C.s3.sysLines[i], 110);
      await ctx.wait(180);
    }
    await ctx.wait(300);
    E.typingSound = false;
    show(r.alert);
    Snd.alert();
    r.alert.classList.add('triple-flash');
    await ctx.wait(900);
    show(r.scanbox);
    r.scanbox.classList.add('photo-reveal');
    await ctx.wait(900);
    Snd.play('scan');
    r.scanbox.classList.add('scanning');
    await ctx.wait(4600);
    show(r.cap);
  }
};

/* =========================================================================
   КАДР 4 — планер
   ========================================================================= */
function monthCard(m) {
  const c = el('article', 'card mcard' + (m.gap ? ' mcard--gap' : ''));
  if (m.photoOnly) {
    c.classList.add('mcard--photo-only');
    c.appendChild(photoSlot(m.photo, 'm-photo'));
    c._bars = [];
    c._words = [];
    return c;
  }
  const top = el('div', 'm-top');
  top.append(el('span', 'n', m.n + '.'), el('span', null, m.m));
  c.appendChild(top);
  if (m.ribbon) c.appendChild(el('span', 'ribbon', m.ribbon));

  const h = el('div', 'm-head');
  h.append(el('span', 'ic', m.icon), el('span', null, m.head));
  c.appendChild(h);
  c.appendChild(list(m.body));

  c._bars = [];
  if (m.bar) { const b = makeBar(m.bar.label, 18, 'sm'); c.appendChild(b); c._bars.push([b, m.bar.to]); }
  if (m.bar2) { const b = makeBar(m.bar2.label, 18, 'sm'); c.appendChild(b); c._bars.push([b, m.bar2.to]); }
  if (m.body2) c.appendChild(list(m.body2));

  if (m.loaders) {
    const box = el('div', 'loaders');
    c._loaders = m.loaders.map(name => {
      const d = el('div');
      d.appendChild(el('span', null, name + ': '));
      const b = el('b', null, '…');
      d.appendChild(b);
      box.appendChild(d);
      return b;
    });
    c.appendChild(box);
  }
  if (m.lock) {
    const l = el('div', 'lock', m.lock.from);
    c.appendChild(l);
    c._lock = [l, m.lock.to];
  }
  if (m.photo) c.appendChild(photoSlot(m.photo, 'm-photo'));
  if (m.sub) {
    const s = el('div', 'm-sub');
    s.appendChild(el('div', 'sh', m.sub.head));
    s.appendChild(list(m.sub.body));
    if (m.sub.lock) s.appendChild(el('div', 'lock un', m.sub.lock));
    c.appendChild(s);
  }
  if (m.quote) c.appendChild(el('div', 'm-quote', m.quote));

  /* текст карточки выводится по словам, когда она встала на место */
  c._words = wordifyAll(c, '.m-head span:last-child, ul li, .m-sub .sh, .m-quote');
  return c;
}

const SC4 = {
  hud: 'SCENE 04',
  build(root) {
    root.className = 'scene';
    const H = head(C.s4.title);
    const meta = el('div', 's4-meta rv');
    C.s4.meta.forEach(m => meta.appendChild(el('span', null, m)));

    const notes = el('div', 's4-notes');
    const noteA = el('div', 's4-note s4-note--a', '↘ ' + C.s4.noteA);
    const noteB = el('div', 's4-note s4-note--b', '↘ ' + C.s4.noteB);
    notes.append(noteA, noteB);

    const grid = el('div', 's4-grid');
    const cards = C.s4.months.map(m => { const c = monthCard(m); grid.appendChild(c); return c; });

    const foot = el('div', 's4-foot rv', C.s4.footer);
    root.append(H.node, H.rule, meta, notes, grid, foot);
    return { H, meta, noteA, noteB, cards, foot };
  },
  async play(ctx, r) {
    await type(ctx, r.H.t, C.s4.title, 28); show(r.H.rule);
    await ctx.wait(1300);
    show(r.meta);
    await ctx.wait(520);
    for (let i = 0; i < r.cards.length; i++) {
      const c = r.cards[i];
      c.classList.add('enter');
      await ctx.wait(620);
      c.classList.remove('enter');
      c.classList.add('settle');
      await ctx.wait(260);

      await revealWords(ctx, c._words, 300);
      for (const [bar, to] of (c._bars || [])) await runBar(ctx, bar, to, 900);
      if (c._loaders) {
        for (const b of c._loaders) { b.textContent = 'LOADING'; await ctx.wait(150); }
      }
      if (c._lock) {
        await ctx.wait(200);
        c._lock[0].textContent = c._lock[1];
        c._lock[0].classList.add('un');
      }
      if (i === 1) { show(r.noteA); await ctx.wait(520); }
      if (i === 3) {
        show(r.noteB);
        await ctx.wait(180);
      }
      await ctx.wait(130);
    }
    if (C.s4.footer) show(r.foot);
    await ctx.wait(1600);
  }
};

/* =========================================================================
   КАДР 5
   ========================================================================= */
const SC5 = {
  hud: 'SCENE 05',
  build(root) {
    root.className = 'scene';
    const H = head(C.s5.title, { quote: C.s5.quote });
    const grid = el('div', 's5-grid');
    const blocks = C.s5.blocks.map(b => {
      const w = el('div', 'card s5-block s5-' + b.key.toLowerCase());
      w.appendChild(el('div', 'k', b.key));
      const ph = b.collage
        ? collageSlot('photos/s5-friends', 3, 'FRIENDS')
        : photoSlot({ src: b.src, title: b.key, label: 'PHOTO / SCAN' });
      if (b.logo) ph.appendChild(optimusLogo(b.logo));
      w.appendChild(ph);
      const cap = el('div', 'cap', b.caption);
      w.appendChild(cap);
      w._words = wordify(cap);
      grid.appendChild(w);
      return w;
    });

    const sum = el('div', 's5-summary rv');
    sum.appendChild(el('div', 'ico', '👥'));
    const txt = el('div', 'txt');
    C.s5.summary.forEach(l => txt.appendChild(el('div', null, l)));
    const bar = makeBar('', 30);
    sum.append(txt, bar);

    const foot = el('div', 's5-foot rv', C.s5.footer);
    root.append(H.node, H.rule, grid, sum, foot);
    return { H, blocks, sum, bar, foot };
  },
  async play(ctx, r) {
    await type(ctx, r.H.t, C.s5.title, 28); show(r.H.rule);
    await ctx.wait(700);
    show(r.H.quote);
    await ctx.wait(2000);
    for (const b of r.blocks) {
      b.classList.add('enter');
      await ctx.wait(850);
      b.classList.remove('enter');
      b.classList.add('settle');
      await revealWords(ctx, b._words, 180);
      await ctx.wait(2000);
    }
    await ctx.wait(300);
    show(r.sum);
    await ctx.wait(400);
    await runBar(ctx, r.bar, 100, 1500);
    if (C.s5.footer) show(r.foot);
    await ctx.wait(1500);
  }
};

/* =========================================================================
   КАДР 6 — карта
   ========================================================================= */
const ANDALUCIA =
  'M63,264 L94,228 L117,180 L140,147 L193,165 L239,147 L293,108 L377,121 L431,85 ' +
  'L492,55 L554,49 L615,72 L676,76 L738,85 L784,67 L830,76 L868,112 L914,157 ' +
  'L952,201 L929,255 L883,291 L906,336 L929,363 L883,390 L822,393 L760,408 ' +
  'L699,413 L638,411 L577,413 L528,415 L493,434 L455,456 L417,488 L386,515 ' +
  'L348,510 L302,497 L256,470 L241,425 L226,380 L172,353 L126,344 L73,327 Z';

function pinNode(p, s) {
  const k = s || 1;
  const g = ns('g', {
    class: 'pin' + (p.hot ? ' hot' : '') + (p.city ? ' city' : ''),
    transform: 'translate(' + p.x + ',' + p.y + ')'
  });
  const anim = ns('g', { class: 'pin-anim' });   // без transform-атрибута: его анимирует CSS
  const box = ns('g', { transform: 'scale(' + k + ')' });

  box.appendChild(ns('path', { d: 'M0,0 C-9,-13 -13,-19 -13,-25 A13,13 0 1 1 13,-25 C13,-19 9,-13 0,0 Z' }));
  box.appendChild(ns('circle', { cx: 0, cy: -25, r: 4.5, fill: '#030d07' }));

  const w = p.name.length * 9.2 + 16;
  let x, y;
  if (p.labelOffset) {
    /* подпись вынесена в сторону от маркера (например, у плотной группы точек) —
       маркер остаётся на точной географической позиции, к подписи ведёт leader line */
    x = p.labelOffset.dx;
    y = p.labelOffset.dy;
    box.appendChild(ns('path', { class: 'leader', d: 'M0,-25 L' + (x + w / 2) + ',' + (y + 12) }));
  } else {
    x = p.side === 'left' ? -(w + 16) : 16;
    y = -12;
  }
  box.appendChild(ns('rect', { x: x, y: y, width: w, height: 24 }));
  const t = ns('text', { x: x + 8, y: y + 17 });
  t.textContent = p.name;
  box.appendChild(t);

  anim.appendChild(box);
  g.appendChild(anim);
  return g;
}

const SC6 = {
  hud: 'SCENE 06',
  build(root) {
    root.className = 'scene';
    const H = head(C.s6.title);
    const grid = el('div', 's6-grid');

    const map = el('div', 'mapbox');
    const regionLbl = el('div', 'lbl lbl-region rv', C.s6.region);
    map.appendChild(regionLbl);
    const svg = ns('svg', { viewBox: '0 0 1000 600', preserveAspectRatio: 'xMidYMid meet' });
    const outline = ns('path', { class: 'outline', d: ANDALUCIA, pathLength: 1000 });
    svg.appendChild(outline);
    const pinsG = ns('g');
    svg.appendChild(pinsG);
    const pins = C.s6.pins.map(p => { const n = pinNode(p); pinsG.appendChild(n); return n; });
    const cityPin = pinNode(Object.assign({ city: true, side: 'left' }, C.s6.malaga));
    pinsG.appendChild(cityPin);
    map.appendChild(svg);

    const side = el('div', 's6-side');
    const zoom = el('div', 'mapbox mapbox--zoomin');
    zoom.appendChild(el('div', 'lbl', C.s6.zoomTitle));
    /* native viewBox исходника (photos/s6-malaga-source.png, 1564×1006) —
       preserveAspectRatio:xMidYMid meet, карта не должна растягиваться.
       Base — тот же кадр БЕЗ пяти POI (см. content.js/zoomPins); каждый
       POI — готовый растровый слой pin+label, вырезанный из исходника в
       ЕГО ЖЕ координатах, поэтому ложится поверх base без подгонки */
    const zsvg = ns('svg', { viewBox: '0 0 1564 1006', preserveAspectRatio: 'xMidYMid meet' });
    const zoutline = ns('image', {
      class: 'malaga-map-base', href: 'photos/s6-malaga-base.png',
      x: 0, y: 0, width: 1564, height: 1006
    });
    zsvg.appendChild(zoutline);
    const zpins = C.s6.zoomPins.map(p => {
      const g = ns('g', { class: 'malaga-poi' });
      g.appendChild(ns('image', { href: p.src, x: p.x, y: p.y, width: p.width, height: p.height }));
      zsvg.appendChild(g);
      return g;
    });
    zoom.appendChild(zsvg);

    const status = el('div', 's6-panel rv');
    status.appendChild(el('div', 'h', 'EXPLORATION'));
    C.s6.status.forEach(l => status.appendChild(el('div', null, l)));

    const sum = el('div', 's6-panel rv');
    sum.appendChild(el('div', 'h', 'SUMMARY'));
    C.s6.summary.forEach(l => sum.appendChild(el('div', null, l)));

    const hot = el('div', 's6-panel s6-hot rv');
    hot.appendChild(el('div', 't', C.s6.highlight[0]));
    hot.appendChild(el('div', null, C.s6.highlight[1]));

    side.append(zoom, status, sum, hot);
    grid.append(map, side);
    root.append(H.node, H.rule, grid);
    return { H, regionLbl, outline, pins, cityPin, zoom, zoutline, zpins, status, sum, hot };
  },
  async play(ctx, r) {
    await type(ctx, r.H.t, C.s6.title, 23); show(r.H.rule);
    await ctx.wait(1200);
    show(r.regionLbl);
    await ctx.wait(1320);
    r.outline.classList.add('draw');
    await ctx.wait(2640);
    show(r.cityPin); Snd.play('blip'); await ctx.wait(1080);
    for (const p of r.pins) { show(p); Snd.play('blip'); await ctx.wait(936); }
    await ctx.wait(600);
    /* «подъезжаем» камерой к точке MÁLAGA перед тем, как открыть карту города */
    r.cityPin.classList.add('approach');
    await ctx.wait(840);
    show(r.zoom);
    r.cityPin.classList.remove('approach');
    await ctx.wait(1080);
    r.zoutline.classList.add('draw');
    await ctx.wait(1200);
    for (const p of r.zpins) { show(p); await ctx.wait(744); }
    await ctx.wait(480);
    await showSeq(ctx, [r.status, r.sum, r.hot], 624);
    await ctx.wait(1800);
  }
};

/* нижний HUD-футер слайда 7:
   [ RICK & MORTY VISUAL ] — [ DATA STREAM / HUD ] — [ LEGACY STATUS ] */
function rmVisual() {
  const box = el('div', 's7-rm rv');
  const img = el('img');
  img.src = 'photos/s7-rickandmorty.png';
  img.alt = 'Rick & Morty';
  box.appendChild(img);
  return box;
}
function streamLine() {
  const svg = ns('svg', { class: 's7-stream-line', viewBox: '0 0 600 12', preserveAspectRatio: 'none' });
  svg.appendChild(ns('path', { d: 'M0,6 L600,6', pathLength: 1000 }));
  return svg;
}
function streamFx() {
  const wrap = el('div', 's7-stream-fx');
  const wave = el('div', 's7-wave');
  for (let i = 0; i < 26; i++) wave.appendChild(el('i'));
  const markers = el('div', 's7-markers blocks');
  for (let i = 0; i < 6; i++) markers.appendChild(el('b', i < 4 ? 'on' : null));
  wrap.append(wave, markers);
  return wrap;
}
function legacyPanel() {
  const box = el('div', 's7-legacy rv');
  const h = el('div', 's7-legacy-h', C.s7.legacy.title);
  const rows = C.s7.legacy.lines.map(l => el('div', 's7-legacy-row rv', l));
  const bar = makeBar('', 16, 'sm');
  box.append(h, ...rows, bar);
  return { box, rows, bar };
}

/* =========================================================================
   КАДР 7
   ========================================================================= */
const SC7 = {
  hud: 'SCENE 07',
  build(root) {
    root.className = 'scene';
    const H = head(C.s7.title, { sub: C.s7.sub });
    const grid = el('div', 's7-grid');

    const cards = [];
    C.s7.blocks.forEach((b, i) => {
      const c = el('article', 'card fcard');
      const h = el('div', 'h');
      h.append(el('span', 'n', b.n), el('span', null, b.t));
      c.append(h, list(b.items));
      c._words = wordifyAll(c, '.h span:last-child, ul li');
      grid.appendChild(c);
      cards.push(c);
    });

    const rm = rmVisual();
    const sLine = streamLine();
    const fx = streamFx();
    const legacy = legacyPanel();
    const stream = el('div', 's7-stream');
    stream.append(sLine, fx);
    const footer = el('div', 's7-footer');
    footer.append(rm, stream, legacy.box);
    const opinion = el('div', 's7-opinion rv', C.s7.opinion);
    cards[3].appendChild(opinion);
    const foot = el('div', 's7-foot');
    const note = el('div', 's7-note rv');
    C.s7.footnote.forEach(l => note.appendChild(el('span', null, l)));
    const ver = el('div', 's7-note rv', C.s7.version);
    foot.append(note, ver);
    root.append(H.node, H.rule, grid, footer, foot);
    return { H, cards, opinion, note, ver, rm, sLine, fx, legacy };
  },
  async play(ctx, r) {
    await type(ctx, r.H.t, C.s7.title, 28); show(r.H.rule);
    await ctx.wait(500);
    await type(ctx, r.H.sub, C.s7.sub, 32);
    await ctx.wait(700);
    for (const c of r.cards) {
      c.classList.add('enter');
      await ctx.wait(650);
      c.classList.remove('enter');
      c.classList.add('settle');
      if (c._words) await revealWords(ctx, c._words, 300);
      await ctx.wait(750);
    }
    await ctx.wait(400);
    show(r.opinion);
    await ctx.wait(500);
    /* 1. HUD/data-stream линия */
    show(r.sLine);
    await ctx.wait(700);
    /* 2. Rick & Morty visual */
    show(r.rm);
    await ctx.wait(650);
    /* 3. waveform / digital-элементы */
    show(r.fx);
    await ctx.wait(700);
    /* 4. LEGACY STATUS появляется */
    show(r.legacy.box);
    await ctx.wait(400);
    /* 5. строки внутри LEGACY STATUS */
    await showSeq(ctx, r.legacy.rows, 260);
    await ctx.wait(300);
    /* 6. progress bar заполняется последним */
    await runBar(ctx, r.legacy.bar, 100, 1300);
    await ctx.wait(400);
    show(r.note); show(r.ver);
    await ctx.wait(1600);
  }
};

/* =========================================================================
   КАДР 8
   ========================================================================= */
const SC8 = {
  hud: 'SCENE 08',
  build(root) {
    root.className = 'scene s8';
    const H = head(C.s8.title, { sub: C.s8.sub });
    const grid = el('div', 's8-grid');

    const mk = t => {
      const c = el('article', 'card tcard');
      const h = el('div', 'h');
      h.append(el('span', null, t.i), el('span', null, t.t));
      c.append(h, el('div', 'd', t.d));
      c._words = wordifyAll(c, '.h span:last-child, .d');
      return c;
    };
    const colL = el('div', 's8-col');
    const colR = el('div', 's8-col');
    const cardsL = C.s8.traits.slice(0, 4).map(t => { const c = mk(t); colL.appendChild(c); return c; });
    const cardsR = C.s8.traits.slice(4).map(t => { const c = mk(t); colR.appendChild(c); return c; });

    /* оригинальная фотография — по центру слайда, между колонками карточек */
    const center = el('div', 's8-center');
    const photo = photoSlot(C.s8.photo, 's8-photo card');
    center.appendChild(photo);

    /* дополнительный текст (без рамок) — продолжает левую колонку под
       карточками 01-04, свободное terminal-текст на фоне, без карточек */
    const status = el('div', 'sc-sub rv', C.s8.status);
    const dev = el('div', 's8-dev rv', C.s8.centerTop);
    const ring = el('div', 'ring rv');
    const rsvg = ns('svg', { viewBox: '0 0 132 132', width: 132, height: 132 });
    rsvg.appendChild(ns('circle', { class: 'bg', cx: 66, cy: 66, r: 58 }));
    const fg = ns('circle', { class: 'fg', cx: 66, cy: 66, r: 58 });
    const CIRC = 2 * Math.PI * 58;
    fg.setAttribute('stroke-dasharray', CIRC);
    fg.setAttribute('stroke-dashoffset', CIRC);
    rsvg.appendChild(fg);
    const num = el('div', 'num', '0%');
    ring.append(rsvg, num);
    const scoreLbl = el('div', 'sc-sub rv', C.s8.score);
    const scoreBox = el('div', 's8-scorebox');
    scoreBox.append(ring, scoreLbl);
    const extraL = el('div', 's8-extra');
    extraL.append(status, dev, scoreBox);
    colL.appendChild(extraL);

    /* дополнительный текст (без рамок) — продолжает правую колонку под
       карточками 05-08 */
    const log = el('div', 's8-log');
    const logNodes = C.s8.centerLog.map(() => { const d = el('div'); log.appendChild(d); return d; });
    const mid = el('div', 's8-mid rv');
    C.s8.centerMid.forEach(l => mid.appendChild(el('div', null, l)));
    const st = el('div', 's8-status rv', C.s8.centerStatus);
    const note = el('div', 's8-note rv');
    C.s8.note.forEach(l => note.appendChild(el('div', null, l)));
    const secret = el('div', 's8-secret rv');
    secret.appendChild(el('b', null, C.s8.secret[0]));
    secret.appendChild(el('div', null, C.s8.secret[1]));
    secret.appendChild(el('div', null, C.s8.secret[2]));
    const extraR = el('div', 's8-extra');
    extraR.append(log, mid, st, note, secret);
    colR.appendChild(extraR);

    grid.append(colL, center, colR);
    root.append(H.node, H.rule, grid);
    return { H, cardsL, cardsR, photo, status, dev, logNodes, mid, st, ring, fg, num, CIRC, scoreLbl, note, secret };
  },
  async play(ctx, r) {
    await type(ctx, r.H.t, C.s8.title, 28); show(r.H.rule);
    await ctx.wait(520);
    show(r.H.sub);
    await ctx.wait(1100);
    r.photo.classList.add('enter');
    await ctx.wait(400);
    r.photo.classList.remove('enter');
    r.photo.classList.add('settle');
    await ctx.wait(260);

    /* карточки чередуются: слева — справа */
    const inter = [];
    for (let i = 0; i < 4; i++) { inter.push(r.cardsL[i]); inter.push(r.cardsR[i]); }
    for (const c of inter) {
      c.classList.add('enter');
      await ctx.wait(620);
      c.classList.remove('enter');
      c.classList.add('settle');
      if (c._words) await revealWords(ctx, c._words, 300);
      await ctx.wait(420);
    }

    /* дополнительный текст без рамок — только теперь, когда весь текст
       во всех карточках 01-08 полностью вышел */
    show(r.status);
    await ctx.wait(360);
    await ctx.wait(300);
    show(r.dev);
    await ctx.wait(300);
    for (const n of r.logNodes) {
      await type(ctx, n, '> ' + C.s8.centerLog[r.logNodes.indexOf(n)], 90);
      await ctx.wait(120);
    }
    show(r.mid);
    await ctx.wait(500);
    show(r.st);
    await ctx.wait(400);
    show(r.ring); show(r.scoreLbl);
    r.fg.style.transition = 'stroke-dashoffset 1.8s ease';
    r.fg.setAttribute('stroke-dashoffset', 0);
    await countTo(ctx, r.num, 100, 1800, '', '%');
    await ctx.wait(400);
    show(r.note);
    await ctx.wait(900);
    show(r.secret);
    await ctx.wait(2200);
  }
};

/* =========================================================================
   КАДР 9
   ========================================================================= */
function trendNode(t, labels) {
  const w = el('div', 'trend');
  const th = el('div', 'th');
  th.append(el('span', null, t.i + ' ' + t.name), el('span', 'tag', t.tag || ''));
  w.appendChild(th);

  const svg = ns('svg', { viewBox: '0 0 300 52', preserveAspectRatio: 'none' });
  svg.appendChild(ns('path', { class: 'axis', d: 'M2,48 L298,48' }));
  const pts = t.data.map((v, i) => [4 + i * (292 / 11), 48 - (v / 100) * 42]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  svg.appendChild(ns('path', { class: 'areaP', d: d + ' L296,48 L4,48 Z' }));
  const line = ns('path', { class: 'lineP', d: d });
  svg.appendChild(line);
  w.appendChild(svg);

  const months = el('div', 's9-months');
  labels.forEach(l => months.appendChild(el('span', null, l)));
  w.appendChild(months);
  return w;
}

const SC9 = {
  hud: 'SCENE 09',
  build(root) {
    root.className = 'scene';
    const H = head(C.s9.title);
    const grid = el('div', 's9-grid');

    /* левая колонка — тренды */
    const left = el('div', 's9-panel');
    const trendsTitle = el('div', 'ph rv strong', C.s9.trendsTitle);
    left.appendChild(trendsTitle);
    const trends = C.s9.trends.map(t => { const n = trendNode(t, C.s9.monthLabels); left.appendChild(n); return n; });
    const shift = el('div', 's9-shift rv', C.s9.shift);
    left.appendChild(shift);

    /* правая колонка — цифры */
    const right = el('div', 's9-panel');
    const statsTitle = el('div', 'ph rv strong', C.s9.statsTitle);
    right.appendChild(statsTitle);
    const stats = C.s9.stats.map(s => {
      const row = el('div', 'statrow rv');
      row.append(el('span', 'l', s.label), el('span', 'dots'));
      const v = el('span', 'v', s.raw != null ? s.raw : '0');
      row.appendChild(v);
      right.appendChild(row);
      return { row, v, s };
    });

    const coffee = el('div', 'coffee rv');
    coffee.appendChild(el('div', 'cl', C.s9.coffee.label));
    const cv = el('div', 'cv', '0');
    coffee.appendChild(cv);
    coffee.appendChild(el('div', 'cu', C.s9.coffee.unit));
    const calert = el('div', 'alert', '⚠ ' + C.s9.coffee.alert);
    coffee.appendChild(calert);
    right.appendChild(coffee);

    const repairsTitle = el('div', 'ph rv strong', C.s9.repairsTitle);
    right.appendChild(repairsTitle);
    const repairs = C.s9.repairs.map(x => {
      const row = el('div', 'statrow rv');
      row.append(el('span', 'l', x.i + ' ' + x.label), el('span', 'dots'), el('span', 'v', x.v));
      right.appendChild(row);
      return row;
    });

    grid.append(left, right);

    const foot = el('div', 's9-foot rv');
    const footText = el('div', 's9-foot-tx');
    C.s9.footnote.forEach(l => footText.appendChild(el('div', null, l)));
    const bar = makeBar(C.s9.progress.label, 40, 'sm');
    foot.append(footText, bar);

    root.append(H.node, H.rule, grid, foot);
    return { H, trendsTitle, statsTitle, repairsTitle, trends, shift, stats, cv, calert, repairs, foot, bar };
  },
  async play(ctx, r) {
    await type(ctx, r.H.t, C.s9.title, 28); show(r.H.rule);
    await ctx.wait(400);
    show(r.trendsTitle);
    await ctx.wait(500);
    for (const t of r.trends) { t.classList.add('in'); await ctx.wait(2700); }
    await ctx.wait(300);
    show(r.shift);
    await ctx.wait(2000);

    show(r.statsTitle);
    await ctx.wait(600);
    for (const st of r.stats) {
      show(st.row);
      if (st.s.raw == null) {
        await countTo(ctx, st.v, st.s.value, st.s.value > 1000 ? 1440 : 780, st.s.prefix || '', st.s.suffix || '');
      }
      await ctx.wait(600);
    }
    await ctx.wait(360);
    show(r.cv.parentNode);
    await countTo(ctx, r.cv, C.s9.coffee.value, 2160);
    show(r.calert);
    await ctx.wait(840);
    show(r.repairsTitle);
    await ctx.wait(540);
    await showSeq(ctx, r.repairs, 540);
    await ctx.wait(480);
    show(r.foot);
    await runBar(ctx, r.bar, C.s9.progress.to, 1920);
    await ctx.wait(1680);
  }
};

/* =========================================================================
   КАДР 10
   ========================================================================= */
const SC10 = {
  hud: C.s10.boot,
  build(root) {
    root.className = 'scene s10';
    const wrap = el('div', 's10-wrap');

    const arch = el('div', 's10-arch rv');
    C.s10.head.forEach(l => arch.appendChild(el('div', 'big', l)));
    C.s10.period.forEach(kv => {
      const row = el('div', 'kv');
      row.append(el('span', null, kv[0]), el('b', null, kv[1]));
      arch.appendChild(row);
    });
    const hlT = el('div', 'ph rv', C.s10.highlightsTitle);
    const hl = el('div', 's10-hl');
    const hlNodes = C.s10.highlights.map(h => { const d = el('div', 'rv', h); hl.appendChild(d); return d; });
    const saved = el('div', 's10-saved');
    const savedNodes = C.s10.saved.map(s => { const d = el('div', 'rv', s); saved.appendChild(d); return d; });
    const thanks = el('div', 's10-thanks rv', C.s10.thanks);
    arch.append(hlT, hl, saved, thanks);

    const term = el('div', 's10-term');
    const promptNodes = C.s10.prompt.map(() => { const d = el('div', 'ln'); term.appendChild(d); return d; });
    const bar = makeBar(C.s10.installLabel, 40, 'rv');
    const sysNodes = C.s10.systems.map(() => { const d = el('div', 'ln'); term.appendChild(d); return d; });
    const logNodes = C.s10.installLog.map(() => { const d = el('div', 'ln'); term.appendChild(d); return d; });
    term.appendChild(bar);
    const done = el('div', 's10-dev rv', C.s10.done);
    term.appendChild(done);

    wrap.append(arch, term);

    const hbd = el('div', 's10-hbd rv', C.s10.hbd);
    const wish = el('div', 's10-wish');
    const wishNodes = C.s10.wishes.map(w => { const d = el('div', 'rv', w); wish.appendChild(d); return d; });
    const tail = el('div', 's10-tail rv');
    C.s10.tail.forEach(t => tail.appendChild(el('div', null, t)));

    const fw = el('canvas');
    fw.id = 'fireworks';

    root.append(wrap, hbd, wish, tail, fw);
    return { arch, hlT, hlNodes, savedNodes, thanks, promptNodes, bar, sysNodes, logNodes, done, hbd, wishNodes, tail, fw };
  },
  async play(ctx, r) {
    Snd.play('outro');
    show(r.arch);
    await ctx.wait(900);
    show(r.hlT);
    await showSeq(ctx, r.hlNodes, 260);
    await ctx.wait(300);
    await showSeq(ctx, r.savedNodes, 300);
    await ctx.wait(400);
    show(r.thanks);
    await ctx.wait(900);

    E.typingSound = true;
    E.typingProfile = 0;
    for (let i = 0; i < C.s10.prompt.length; i++) {
      await type(ctx, r.promptNodes[i], C.s10.prompt[i], 40);
      await ctx.wait(400);
    }
    for (let i = 0; i < C.s10.systems.length; i++) {
      await type(ctx, r.sysNodes[i], C.s10.systems[i], 90);
      await ctx.wait(130);
    }
    await ctx.wait(300);
    for (let i = 0; i < C.s10.installLog.length; i++) {
      await type(ctx, r.logNodes[i], '> ' + C.s10.installLog[i], 62);
      await ctx.wait(220);
    }
    E.typingSound = false;
    await ctx.wait(300);
    show(r.bar);
    await ctx.wait(400);
    await runBar(ctx, r.bar, 100, 2400);

    /* Переход на 11-й кадр привязан СТРОГО к завершению именно этой
       дорожки (см. addEventListener('ended', ...) ниже) — не к тому,
       сколько ещё продлятся fireworks/пожелания/эта функция. goTo() в
       app.js специально не запускает обычный auto-next для кадра 10
       (см. special-case там же), поэтому единственный, кто вызывает
       переход — обработчик 'ended'. Сама эта функция вполне может быть
       прервана токеном сцены задолго до своего естественного конца —
       это ожидаемо и не является багом. */
    Snd.play('mario');
    const marioTrack = Snd.tracks.mario;
    if (marioTrack && !marioTrack._dead) {
      const onMarioEnded = () => { if (!ctx.dead && E.autoplay) goTo(10); };
      marioTrack.addEventListener('ended', onMarioEnded, { once: true });
      r._marioCleanup = () => marioTrack.removeEventListener('ended', onMarioEnded);
    }
    await ctx.wait(300);
    show(r.done);
    await ctx.wait(900);

    show(r.hbd);
    r._stopFw = fireworks(r.fw);
    await ctx.wait(900);
    await showSeq(ctx, r.wishNodes, 950);
    await ctx.wait(700);
    show(r.tail);
    await ctx.wait(6000);
  },
  stop(r) {
    if (r && r._stopFw) { r._stopFw(); r._stopFw = null; }
    if (r && r._marioCleanup) { r._marioCleanup(); r._marioCleanup = null; }
  }
};

const SCENES = [SC1, SC2, SC3, SC4, SC5, SC6, SC7, SC8, SC9, SC10];
