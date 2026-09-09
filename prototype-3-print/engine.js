/* =========================================================================
   ENGINE — таймлайн сцен, помощники анимации, окно с фото, звук
   ========================================================================= */

const E = {
  paused: false,
  instant: false,   // «доиграть кадр мгновенно»
  speed: 1,
  token: 0,        // токен текущего проигрывания сцены
  autoplay: true,
  typingSound: false,
  typingProfile: 0,
  deniedAlert: false
};

const SKIP = Symbol('scene-skipped');

/* --- утилиты DOM --- */
const el = (tag, cls, txt) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (txt != null) n.textContent = txt;
  return n;
};
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* --- ожидание с учётом паузы, скорости и отмены сцены --- */
function ctxFor(token) {
  const alive = () => E.token === token;
  return {
    get dead() { return E.token !== token; },
    async wait(ms) {
      if (E.instant) { if (!alive()) throw SKIP; return; }
      let left = ms / E.speed;
      while (left > 0) {
        if (!alive()) throw SKIP;
        const step = Math.min(40, left);
        await new Promise(r => setTimeout(r, step));
        if (!E.paused) left -= step;
      }
      if (!alive()) throw SKIP;
    }
  };
}

/* --- печать текста ---------------------------------------------------------
   TYPE_SLOW — единственная ручка скорости набора. Меньше значение — медленнее
   идут буквы. 1 = исходный темп, 0.6 = примерно на 4–5 секунд дольше на кадр.
   WORD_GAP — пауза между словами там, где текст выводится по словам.
--------------------------------------------------------------------------- */
const TYPE_SLOW = 0.40;
const WORD_GAP  = 86;

async function type(ctx, node, text, cps = 55) {
  node.textContent = '';
  node.classList.add('in');
  const caret = el('span', 'caret');
  node.appendChild(caret);
  const delay = 1000 / (cps * TYPE_SLOW);
  for (let i = 0; i < text.length; i++) {
    node.insertBefore(document.createTextNode(text[i]), caret);
    const c = text[i];
    if (E.typingSound && !/\s/.test(c)) Snd.typeClick(c);
    await ctx.wait(delay * (c === '.' || c === ',' || c === ':' ? 3 : 1));
  }
  caret.remove();
}

/* печать строки вида "> TEXT — VERDICT" с цветным вердиктом */
async function typeVerdict(ctx, node, t, v, cps = 65) {
  const a = el('span'); node.appendChild(a);
  await type(ctx, a, '> ' + t, cps);
  await ctx.wait(140);
  const b = el('span', v === 'DENIED' ? 'no' : 'ok');
  node.appendChild(b);
  const resumeTyping = E.typingSound;
  if (v === 'DENIED') {
    if (E.deniedAlert) {
      E.typingSound = false;
      Snd.alert();
    }
    else Snd.play('blip');
  }
  await type(ctx, b, ' — ' + v, cps + 30);
  E.typingSound = resumeTyping;
}

/* --- пословный вывод -------------------------------------------------------
   wordify() разбивает текст на <span class="word">, сохраняя пробелы
   отдельными текстовыми узлами — отступы в списках не ломаются.
--------------------------------------------------------------------------- */
function wordify(node) {
  const txt = node.textContent;
  node.textContent = '';
  txt.split(/(\s+)/).forEach(p => {
    if (!p) return;
    if (/^\s+$/.test(p)) node.appendChild(document.createTextNode(p));
    else node.appendChild(el('span', 'word', p));
  });
  return [...node.querySelectorAll('.word')];
}

/* собирает слова из всех текстовых строк карточки */
function wordifyAll(root, selectors) {
  const words = [];
  root.querySelectorAll(selectors).forEach(n => words.push(...wordify(n)));
  return words;
}

async function revealWords(ctx, words, gap) {
  const g = gap == null ? WORD_GAP : gap;
  for (const w of words) { w.classList.add('in'); await ctx.wait(g); }
}

/* --- показать элемент(ы) --- */
const show = n => { if (n) n.classList.add('in'); };
async function showSeq(ctx, nodes, gap = 180) {
  for (const n of nodes) { show(n); await ctx.wait(gap); }
}

/* --- прогресс-бар --- */
function makeBar(label, cells = 34, cls = '') {
  const w = el('div', 'pbar ' + cls);
  if (label) w.appendChild(el('span', 'lbl', label));
  const tr = el('div', 'track');
  for (let i = 0; i < cells; i++) tr.appendChild(el('i'));
  const val = el('span', 'val', '0%');
  w.append(tr, val);
  w._cells = [...tr.children];
  w._val = val;
  return w;
}
async function runBar(ctx, bar, to, dur = 1600) {
  const n = bar._cells.length;
  const steps = Math.max(1, Math.round(to));
  const per = dur / steps;
  for (let p = 1; p <= steps; p++) {
    const lit = Math.round(n * p / 100);
    bar._cells.forEach((c, i) => c.classList.toggle('on', i < lit));
    bar._val.textContent = p + '%';
    await ctx.wait(per);
  }
}

/* --- счётчик чисел --- */
const fmt = n => n.toLocaleString('ru-RU').replace(/ /g, ' ');
async function countTo(ctx, node, to, dur = 1200, prefix = '', suffix = '') {
  if (to === 0) { node.textContent = prefix + '0' + suffix; return; }
  const steps = Math.min(40, Math.max(8, Math.round(dur / 40)));
  for (let i = 1; i <= steps; i++) {
    const eased = 1 - Math.pow(1 - i / steps, 3);
    node.textContent = prefix + fmt(Math.round(to * eased)) + suffix;
    await ctx.wait(dur / steps);
  }
  node.textContent = prefix + fmt(to) + suffix;
}

/* --- карточки: приход поверх кадра → zoom → место --- */
async function dealCards(ctx, cards, gap = 320, settleAfter = 380) {
  for (const c of cards) {
    c.classList.add('enter');
    await ctx.wait(settleAfter);
    c.classList.remove('enter');
    c.classList.add('settle');
    await ctx.wait(gap);
  }
}

/* --- фото-слот --- */
function photoSlot(cfg, cls) {
  const box = el('div', 'photo ' + (cls || ''));
  const img = el('img');
  img.alt = cfg.title || '';
  img.loading = 'lazy';
  img.draggable = false;
  img.addEventListener('load', () => box.classList.add('has-img'));
  img.addEventListener('error', () => img.remove());
  img.src = cfg.src;
  const ph = el('div', 'ph');
  ph.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">' +
    '<rect x="2.5" y="4.5" width="19" height="15"/><circle cx="12" cy="12" r="3.6"/>' +
    '<path d="M8 4.5l1.6-2h4.8l1.6 2"/></svg>';
  ph.appendChild(el('span', null, cfg.label || 'PHOTO / SCAN'));
  box.append(img, ph);
  box.addEventListener('click', () => openWin(cfg));
  box.tabIndex = 0;
  box.addEventListener('keydown', e => { if (e.key === 'Enter') openWin(cfg); });
  return box;
}

/* --- ретро-окно с фото --- */
function openWin(cfg) {
  const w = $('#win');
  $('#winTitle').textContent = (cfg.title || 'IMAGE').toUpperCase() + '.JPG';
  const body = $('#winBody');
  body.innerHTML = '';
  const img = el('img');
  img.alt = cfg.title || '';
  img.addEventListener('error', () => {
    body.innerHTML = '';
    const em = el('div', 'empty');
    em.append(
      el('div', null, 'IMAGE NOT FOUND'),
      el('div', null, cfg.src),
      el('div', null, 'Положите файл в prototype-3/photos/ — окно подхватит его автоматически.')
    );
    body.appendChild(em);
  });
  img.src = cfg.src;
  body.appendChild(img);
  $('#winFoot').textContent = 'SOURCE: ' + cfg.src + '   ·   ESC / CLICK OUTSIDE TO CLOSE';
  w.classList.add('on');
}
function closeWin() { $('#win').classList.remove('on'); }

/* --- звук ---------------------------------------------------------------
   Дорожки создаются как реальные <audio> в DOM, поэтому их подхватывает
   общая кнопка mute из ../assets/audio-control.js (ключ birthday-archive-muted).
------------------------------------------------------------------------- */
const MUTE_KEY = 'birthday-archive-muted';
const Snd = {
  tracks: {},
  typeCtx: null,
  lastTypeAt: 0,
  get muted() { return localStorage.getItem(MUTE_KEY) === 'true'; },
  unlockType() {
    if (this.typeCtx) {
      if (this.typeCtx.state === 'suspended') this.typeCtx.resume().catch(() => {});
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.typeCtx = new AudioCtx();
    if (this.typeCtx.state === 'suspended') this.typeCtx.resume().catch(() => {});
  },
  typeClick(char) {
    if (this.muted) return;
    this.unlockType();
    const ac = this.typeCtx;
    if (!ac || ac.state !== 'running') return;

    /* Физическая клавиша: шумовой удар + резонанс корпуса + тихое отпускание. */
    const now = ac.currentTime;
    if (now - this.lastTypeAt < .018) return;
    this.lastTypeAt = now;
    const punctuation = /[.,:;!?\-—]/.test(char);
    const profile = E.typingProfile % 3;

    const keyHit = ({ bodyHz, clickHz, volume, length, release }) => {
      const frames = Math.ceil(ac.sampleRate * length);
      const buffer = ac.createBuffer(1, frames, ac.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < frames; i++) {
        const decay = Math.pow(1 - i / frames, 3.2);
        data[i] = (Math.random() * 2 - 1) * decay;
      }
      const source = ac.createBufferSource();
      const high = ac.createBiquadFilter();
      const body = ac.createBiquadFilter();
      const gain = ac.createGain();
      source.buffer = buffer;
      high.type = 'highpass'; high.frequency.value = clickHz;
      body.type = 'peaking'; body.frequency.value = bodyHz; body.Q.value = 2.4; body.gain.value = 9;
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(.0001, now + length);
      source.connect(high); high.connect(body); body.connect(gain); gain.connect(ac.destination);
      source.start(now);

      const releaseGain = ac.createGain();
      const releaseFilter = ac.createBiquadFilter();
      const releaseSource = ac.createBufferSource();
      releaseSource.buffer = buffer;
      releaseFilter.type = 'bandpass'; releaseFilter.frequency.value = bodyHz * 1.35; releaseFilter.Q.value = 1.6;
      releaseGain.gain.setValueAtTime(volume * .34, now + release);
      releaseGain.gain.exponentialRampToValueAtTime(.0001, now + release + .012);
      releaseSource.connect(releaseFilter); releaseFilter.connect(releaseGain); releaseGain.connect(ac.destination);
      releaseSource.start(now + release, 0, .014);
    };

    if (profile === 0) {
      /* 1: звонкий clicky-переключатель. */
      keyHit({ bodyHz: punctuation ? 1650 : 2100, clickHz: 900, volume: .20, length: .026, release: .034 });
    } else if (profile === 1) {
      /* 2: более глухой tactile-переключатель. */
      keyHit({ bodyHz: punctuation ? 620 : 760, clickHz: 260, volume: .24, length: .042, release: .046 });
    } else {
      /* 3: глубокий linear/thock с выраженным корпусом. */
      keyHit({ bodyHz: punctuation ? 360 : 470, clickHz: 150, volume: .28, length: .055, release: .052 });
    }
  },
  alert() {
    if (this.muted) return;
    this.unlockType();
    const ac = this.typeCtx;
    if (!ac || ac.state !== 'running') return;
    const now = ac.currentTime;
    [0, .13].forEach((offset, index) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(index ? 245 : 185, now + offset);
      gain.gain.setValueAtTime(.085, now + offset);
      gain.gain.exponentialRampToValueAtTime(.0001, now + offset + .105);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(now + offset);
      osc.stop(now + offset + .11);
    });
  },
  load(name, src, loop, vol) {
    const a = document.createElement('audio');
    a.src = src;
    a.loop = !!loop;
    a.volume = vol == null ? 0.5 : vol;
    a.preload = 'auto';
    a.dataset.track = name;
    a.muted = this.muted;
    a.addEventListener('error', () => { a._dead = true; });
    document.body.appendChild(a);
    this.tracks[name] = a;
  },
  play(name) {
    const a = this.tracks[name];
    if (!a || a._dead) return;
    try { a.currentTime = 0; a.play().catch(() => {}); } catch (e) {}
  },
  stop(name) {
    const a = this.tracks[name];
    if (a) { try { a.pause(); } catch (e) {} }
  },
  async fadeOut(name, ms) {
    const a = this.tracks[name];
    if (!a || a._dead || a.paused) return;
    const v0 = a.volume, steps = 20;
    for (let i = 1; i <= steps; i++) {
      a.volume = Math.max(0, v0 * (1 - i / steps));
      await new Promise(r => setTimeout(r, (ms || 1500) / steps));
    }
    a.pause();
    a.volume = v0;
  },
  stopAll() { Object.values(this.tracks).forEach(a => { try { a.pause(); } catch (e) {} }); }
};

/* --- салюты в пиксельно-консольном стиле --- */
function fireworks(canvas) {
  const c = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth || 1600;
  const H = canvas.height = canvas.offsetHeight || 900;
  const parts = [];
  const palette = ['#4ef08a', '#ccffe2', '#ffc85a', '#5aa8ff', '#ff5d47'];
  let raf, alive = true;

  function burst() {
    const x = W * (0.15 + Math.random() * 0.7);
    const y = H * (0.12 + Math.random() * 0.45);
    const col = palette[(Math.random() * palette.length) | 0];
    const n = 34 + ((Math.random() * 22) | 0);
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n + Math.random() * 0.2;
      const sp = 1.6 + Math.random() * 3.4;
      parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, col });
    }
  }
  function frame() {
    if (!alive) return;
    c.clearRect(0, 0, W, H);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.x += p.vx; p.y += p.vy; p.vy += 0.045; p.vx *= 0.992; p.vy *= 0.992;
      p.life -= 0.012;
      if (p.life <= 0) { parts.splice(i, 1); continue; }
      c.globalAlpha = Math.max(0, p.life);
      c.fillStyle = p.col;
      c.fillRect(p.x | 0, p.y | 0, 3, 3);
    }
    c.globalAlpha = 1;
    raf = requestAnimationFrame(frame);
  }
  frame();
  const iv = setInterval(burst, 520);
  burst();
  return () => { alive = false; clearInterval(iv); cancelAnimationFrame(raf); c.clearRect(0, 0, W, H); };
}
