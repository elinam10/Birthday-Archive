/* =========================================================================
   APP — загрузка, менеджер сцен, HUD, управление
   ========================================================================= */

const stage    = $('#stage');
const viewport = $('#viewport');
const scenesEl = $('#scenes');
const gapEl    = $('#gap');

let cur = -1;
const refs = [];
const roots = [];
let started = Date.now();
let startTimers = [];

/* билд-номер нигде не показывается — только внутри DOM, для отладки */
document.documentElement.dataset.build = window.PROTOTYPE_VERSION;

/* ---------------- звук: берём библиотеку самого репозитория ---------------- */
Snd.load('boot',  '../assets/sounds/matrix-monitor.mp3',      false, .45);
Snd.load('scan',  '../assets/sounds/scan.mp3',                false, .55);
Snd.load('blip',  '../assets/sounds/matrix-materialize.mp3',  false, .22);
Snd.load('music', '../assets/sounds/matrix-clubbed-to-death.mp3', true, .26);
Snd.load('outro', '../assets/sounds/matrix-monitor.mp3',      false, .40);
Snd.load('mario', '../assets/sounds/mario-level-complete.mp3', false, .55);

/* Только music: 353 — dry OFF, короткое эхо; 354 — тишина; 355 — Scene 10. */
function watchMusicEnding() {
  const a = Snd.tracks.music;
  const baseVolume = a.volume, STOP_AT = 353;
  let graph, endingStarted = false, cutAt;
  let stopTimer, silenceTimer, transitionTimer;

  function gains(dry, send, wet) {
    if (!graph) return;
    const now = graph.ac.currentTime;
    [graph.dry, graph.send, graph.wet].forEach((node, i) => {
      node.gain.cancelScheduledValues(now);
      node.gain.setValueAtTime([dry, send, wet][i], now);
    });
  }
  function reset() {
    clearTimeout(stopTimer);
    clearTimeout(silenceTimer);
    clearTimeout(transitionTimer);
    endingStarted = false;
    cutAt = null;
    a.volume = baseVolume;
    gains(1, 1, 0);
    if (!graph) return;
    // Новые delay buffers исключают остаток прошлого хвоста при replay.
    graph.send.disconnect();
    graph.taps.forEach(node => node.disconnect());
    graph.taps = [];
    [0.28, 0.56, 0.84].forEach((seconds, i) => {
      const delay = graph.ac.createDelay(1), level = graph.ac.createGain();
      delay.delayTime.value = seconds;
      level.gain.value = [0.36, 0.16, 0.07][i];
      graph.send.connect(delay).connect(level).connect(graph.wet);
      graph.taps.push(delay, level);
    });
  }
  function connect() {
    if (graph) return;
    Snd.unlockType();
    const ac = Snd.typeCtx;
    const source = ac.createMediaElementSource(a);
    const dry = ac.createGain(), send = ac.createGain();
    const wet = ac.createGain(), output = ac.createGain();
    graph = { ac, dry, send, wet, output, taps: [] };
    output.gain.value = a.muted ? 0 : 1;
    source.connect(dry).connect(output);
    source.connect(send);
    wet.connect(output).connect(ac.destination);
    reset();
  }
  function finish() {
    if (endingStarted || a.paused) return;
    if (a.currentTime < STOP_AT) { schedule(); return; }
    endingStarted = true;
    clearTimeout(stopTimer);
    const now = graph.ac.currentTime;
    const end = cutAt == null ? now : cutAt;
    gains(0, 0, 1);
    graph.wet.gain.setValueAtTime(0, Math.max(now, end + 1));
    // Delay buffers уже содержат последние 0.84 с; pause не обрывает их.
    a.pause();
    const token = E.token;
    silenceTimer = setTimeout(() => {
      graph.wet.gain.value = 0;
      a.volume = 0;
    }, Math.max(0, end + 1 - now) * 1000);
    transitionTimer = setTimeout(() => {
      if (endingStarted && E.token === token && E.autoplay && cur === 8) goTo(9);
    }, Math.max(0, end + 2 - now) * 1000);
  }
  function schedule() {
    if (!graph || endingStarted || a.paused || a.seeking || graph.ac.state !== 'running') return;
    clearTimeout(stopTimer);
    const remaining = Math.max(0, (STOP_AT - a.currentTime) / a.playbackRate);
    cutAt = graph.ac.currentTime + remaining;
    gains(1, 1, 0);
    // Audio clock обеспечивает резкую границу, даже между timeupdate.
    graph.dry.gain.setValueAtTime(0, cutAt);
    graph.send.gain.setValueAtTime(0, cutAt);
    graph.wet.gain.setValueAtTime(1, cutAt);
    graph.wet.gain.setValueAtTime(0, cutAt + 1);
    if (!remaining) finish();
    else stopTimer = setTimeout(finish, remaining * 1000);
  }
  function suspendSchedule() {
    if (endingStarted) return;
    clearTimeout(stopTimer);
    cutAt = null;
    gains(1, 1, 0);
  }
  a.addEventListener('play', () => {
    connect();
    if (a.currentTime < STOP_AT) reset();
    graph.ac.resume().then(schedule).catch(() => {});
  });
  ['playing', 'timeupdate', 'ratechange'].forEach(event => a.addEventListener(event, schedule));
  ['pause', 'waiting', 'seeking'].forEach(event => a.addEventListener(event, suspendSchedule));
  a.addEventListener('seeked', () => {
    if (endingStarted && a.currentTime < STOP_AT) reset();
    schedule();
  });
  // Существующий mute должен отключать и уже накопленный echo buffer.
  a.addEventListener('volumechange', () => {
    if (graph) graph.output.gain.value = a.muted ? 0 : 1;
  });
  return reset;
}
const resetMusicEnding = watchMusicEnding();

/* ---------------- масштабирование сцены под экран ---------------- */
/* тот же брейкпоинт, что и в styles.css: мобильная (портретная) раскладка
   остаётся мобильной, даже если телефон развернуть в альбомную ориентацию —
   короткая сторона телефона (высота в альбомной) остаётся маленькой
   независимо от разворота, в отличие от одного только max-width. */
const MOBILE_MQ = '(max-width:900px), (pointer:coarse) and (orientation:landscape) and (max-height:500px)';
function fit() {
  if (matchMedia(MOBILE_MQ).matches) { stage.style.transform = ''; return; }
  const s = Math.min(viewport.clientWidth / 1600, viewport.clientHeight / 900);
  stage.style.transform = 'scale(' + s + ')';
}
addEventListener('resize', fit);
addEventListener('orientationchange', fit);

/* ---------------- HUD ---------------- */
function pad(n) { return String(n).padStart(2, '0'); }
function updateHUD() {
  $('#hudScene').textContent = SCENES[cur] ? SCENES[cur].hud : '';
  const filled = Math.round(((cur + 1) / SCENES.length) * 5);
  $$('#hudBlocks b').forEach((b, i) => b.classList.toggle('on', i < filled));
  $$('#dots button').forEach((b, i) => b.classList.toggle('on', i === cur));
}
setInterval(() => {
  const s = Math.floor((Date.now() - started) / 1000);
  $('#hudTime').textContent = 'EST. TIME: ' + pad(Math.floor(s / 3600)) + ':' + pad(Math.floor(s / 60) % 60) + ':' + pad(s % 60);
}, 1000);

/* ---------------- сборка сцен ---------------- */
function buildAll() {
  SCENES.forEach((s, i) => {
    const root = el('section', 'scene');
    root.dataset.i = i;
    scenesEl.appendChild(root);
    roots[i] = root;
    refs[i] = s.build(root);
  });
}
function rebuild(i) {
  const root = roots[i];
  if (SCENES[i].stop) SCENES[i].stop(refs[i]);
  root.innerHTML = '';
  root.removeAttribute('style');
  refs[i] = SCENES[i].build(root);
}

/* ---------------- переход к сцене ---------------- */
async function goTo(i) {
  if (i < 0 || i >= SCENES.length) return;
  E.typingSound = false;
  E.deniedAlert = false;
  if (cur >= 0 && SCENES[cur].stop) SCENES[cur].stop(refs[cur]);
  if (i <= 3 || i > 8) { Snd.stop('music'); resetMusicEnding(); }

  E.token++;
  const token = E.token;
  E.paused = false;
  $('#btnPause').textContent = '❚❚ PAUSE';
  gapEl.classList.toggle('on', i === 9);

  rebuild(i);
  roots.forEach((n, k) => n.classList.toggle('active', k === i));
  cur = i;
  updateHUD();
  fit();

  /* Переход 9 → 10 больше не держит паузу здесь — см. watchMusicEnding()
     ниже: он вызывает goTo(9) после hard stop на 05:53, секунды эха и секунды тишины. */
  gapEl.classList.remove('on');

  const ctx = ctxFor(token);
  try {
    await SCENES[i].play(ctx, refs[i]);
  } catch (e) {
    if (e !== SKIP) console.error(e);
    return;
  }
  if (E.token !== token || !E.autoplay) return;

  /* Переход 9 → 10 не идёт через обычный auto-next: его исключительно
     запускает watchMusicEnding() после hard stop на 05:53, секунды эха и секунды тишины, вне
     зависимости от того, успела ли доиграть визуальная временная шкала
     Кадра 9. Переход 10 → 11 переходит не по завершению этой функции, а
     строго по событию 'ended' аудио Mario (см. SC10.play()/onMarioEnded
     в scenes.js) — иначе переход случился бы раньше конца мелодии (как
     только доиграют fireworks/пожелания) или сработал бы дважды. */
  if (i === 8 || i === 9) return;

  if (E.token !== token) return;
  if (i < SCENES.length - 1) goTo(i + 1);
}

/* Тестовый переход по цифрам: без заставки, пауз и автоперехода. */
async function jumpTo(i) {
  startTimers.forEach(clearTimeout);
  startTimers = [];
  E.token++; // останавливает текущую сцену или заставку
  Snd.unlockType();
  $('#flicker').classList.add('on');
  gapEl.classList.remove('on');

  const wasInstant = E.instant;
  const wasAutoplay = E.autoplay;
  E.instant = true;
  E.autoplay = false;
  try {
    await goTo(i);
  } finally {
    E.instant = wasInstant;
    E.autoplay = wasAutoplay;
  }
}

/* ---------------- управление ---------------- */
function initControls() {
  const dots = $('#dots');
  SCENES.forEach((s, i) => {
    const b = el('button', null, pad(i + 1));
    b.title = C.menu[i];
    b.addEventListener('click', () => jumpTo(i));
    dots.appendChild(b);
  });

  $('#btnPrev').addEventListener('click', () => goTo(cur - 1));
  $('#btnNext').addEventListener('click', () => goTo(cur + 1));
  $('#btnReplay').addEventListener('click', () => goTo(cur));
  $('#btnPause').addEventListener('click', togglePause);

  $('#btnAuto').addEventListener('click', e => {
    E.autoplay = !E.autoplay;
    e.currentTarget.classList.toggle('on', E.autoplay);
    e.currentTarget.textContent = E.autoplay ? 'AUTO: ON' : 'AUTO: OFF';
  });

  $('#btnSpeed').addEventListener('click', e => {
    E.speed = E.speed === 1 ? 1.5 : E.speed === 1.5 ? 2 : 1;
    e.currentTarget.textContent = 'SPEED ' + E.speed + '×';
  });

  $('#btnRecord').addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') stopRecording();
    else startRecording();
  });

  $('#btnMenu').addEventListener('click', () => $('#menu').classList.add('on'));
  $('#menu').addEventListener('click', e => { if (e.target.id === 'menu') $('#menu').classList.remove('on'); });

  const listEl = $('#menuList');
  C.menu.forEach((m, i) => {
    const b = el('button');
    b.append(el('span', 'n', pad(i + 1)), el('span', null, m));
    b.addEventListener('click', () => { $('#menu').classList.remove('on'); jumpTo(i); });
    listEl.appendChild(b);
  });

  /* общая кнопка звука из ../assets/audio-control.js — переносим в панель */
  const gTog = document.querySelector('.global-audio-toggle');
  if (gTog) $('#bar').appendChild(gTog);

  $('#win').addEventListener('click', e => { if (e.target.id === 'win') closeWin(); });
  $('#winClose').addEventListener('click', closeWin);

  /* нигде в презентации нет настоящего drag-and-drop UX — только клики
     по фото (открывают окно, см. photoSlot/openWin). draggable=false и
     CSS user-drag уже стоят на самих <img>, это подстраховка на случай,
     если браузер всё равно предложит перетащить картинку */
  addEventListener('dragstart', e => { if (e.target instanceof HTMLImageElement) e.preventDefault(); });

  addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeWin(); $('#menu').classList.remove('on'); return; }
    const digit = e.code.match(/^(?:Digit|Numpad)([0-9])$/);
    if (digit) {
      e.preventDefault();
      const n = Number(digit[1]);
      jumpTo(n === 0 ? 9 : n - 1);
      return;
    }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(cur + 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(cur - 1); }
    if (e.code === 'Space')     { e.preventDefault(); togglePause(); }
    if (e.key === 'r' || e.key === 'к') goTo(cur);
  });
}
/* Браузер троттлит таймеры в фоновой вкладке — честно ставим на паузу,
   чтобы кадр не «полз» вместо того, чтобы идти в заданном ритме. */
let pausedByHide = false;
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (!E.paused) { pausedByHide = true; togglePause(); }
  } else if (pausedByHide) {
    pausedByHide = false;
    if (E.paused) togglePause();
  }
});

function togglePause() {
  E.paused = !E.paused;
  $('#btnPause').textContent = E.paused ? '▶ RESUME' : '❚❚ PAUSE';
  $('#stage').classList.toggle('is-paused', E.paused);
}

/* ---------------- запись экрана ----------------
   Кнопка "● REC" запускает запись экрана через getDisplayMedia + MediaRecorder,
   кнопка "■ STOP" (то же место) её останавливает — по остановке видео сразу
   скачивается файлом. Отдельного сервера/бэкенда не требуется: всё живёт
   в памяти вкладки, ролик собирается в Blob и отдаётся через <a download>. */
let mediaRecorder = null;
let recordStream = null;
let recordedChunks = [];

function pickRecorderMimeType() {
  /* mp4 первым — если браузер умеет писать сразу в mp4 (Safari, новые
     Chrome/Edge), используем его; иначе тихо откатываемся на webm
     (Firefox и часть браузеров mp4-запись через MediaRecorder не умеют). */
  const candidates = [
    'video/mp4;codecs=avc1,mp4a.40.2',
    'video/mp4',
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm'
  ];
  return candidates.find(t => window.MediaRecorder && MediaRecorder.isTypeSupported(t)) || '';
}

function setRecordButtonState(isRecording) {
  const b = $('#btnRecord');
  if (!b) return;
  b.classList.toggle('recording', isRecording);
  b.textContent = isRecording ? '■ STOP' : '● REC';
  b.title = isRecording
    ? 'Остановить запись и скачать видео'
    : 'Запись экрана — после остановки видео скачается автоматически';
}

async function startRecording() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia || !window.MediaRecorder) {
    alert('Запись экрана не поддерживается этим браузером.');
    return;
  }
  try {
    /* preferCurrentTab — нестандартное (Chrome/Chromium) расширение API:
       просит браузер по умолчанию предложить/выбрать именно эту вкладку
       вместо экрана/окна. cursor:'never' просит не рисовать курсор мыши
       поверх кадров записи. Оба — необязательные хинты: в браузерах без
       поддержки просто игнорируются, и остаётся обычное поведение. */
    recordStream = await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: 30, displaySurface: 'browser', cursor: 'never' },
      audio: true,
      preferCurrentTab: true,
    });
  } catch (err) {
    return; /* пользователь отменил выбор источника экрана */
  }
  recordedChunks = [];
  const mimeType = pickRecorderMimeType();
  mediaRecorder = mimeType ? new MediaRecorder(recordStream, { mimeType }) : new MediaRecorder(recordStream);

  mediaRecorder.addEventListener('dataavailable', e => {
    if (e.data && e.data.size > 0) recordedChunks.push(e.data);
  });
  mediaRecorder.addEventListener('stop', () => {
    recordStream.getTracks().forEach(t => t.stop());
    recordStream = null;
    const actualMime = mediaRecorder.mimeType || 'video/webm';
    const blob = new Blob(recordedChunks, { type: actualMime });
    recordedChunks = [];
    const url = URL.createObjectURL(blob);
    const ext = actualMime.includes('mp4') ? 'mp4' : 'webm';
    const a = el('a');
    a.href = url;
    a.download = 'birthday-archive-recording-' + Date.now() + '.' + ext;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 15000);
    mediaRecorder = null;
    setRecordButtonState(false);
  });

  /* пользователь может остановить показ экрана через системный UI браузера,
     а не через нашу кнопку — тогда тоже аккуратно завершаем запись */
  recordStream.getVideoTracks()[0].addEventListener('ended', () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
  });

  mediaRecorder.start();
  setRecordButtonState(true);
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
}

function start() {
  $('#flicker').classList.add('on');
  started = Date.now();
  gapEl.classList.remove('on');
  goTo(0);
}

/* ---------------- старт ---------------- */
buildAll();
initControls();
fit();
start();
