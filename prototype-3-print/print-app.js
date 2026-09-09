/* =========================================================================
   PRINT APP — renders exactly ONE scene, fully settled (no animation), for
   PDF export. Reuses content.js / engine.js / scenes.js verbatim: the same
   E.instant fast-path the web version already uses for its "jump to scene"
   feature (see jumpTo() in the web app.js) makes every ctx.wait() resolve
   immediately, so SCENES[i].play() runs the exact same build/reveal logic
   as the live show and lands on the exact same final DOM state -- just
   without the real-time delays.

   Usage: index.html?scene=N   (1-based, matches the printed 01.pdf..NN.pdf)
   Signals completion by setting <html data-print-ready="true">, which the
   Playwright export script waits for before calling page.pdf().
   ========================================================================= */

/* silence audio entirely -- print has no sound, and we never Snd.load()
   any track, so these would otherwise try to construct a real AudioContext
   for every typed character for no reason */
Snd.play = () => {};
Snd.alert = () => {};
Snd.typeClick = () => {};
Snd.stop = () => {};
Snd.fadeOut = async () => {};
Snd.unlockType = () => {};

E.instant = true;
E.autoplay = false;

function pad(n) { return String(n).padStart(2, '0'); }

function sceneIndexFromURL() {
  const n = Number(new URLSearchParams(location.search).get('scene'));
  if (!Number.isInteger(n) || n < 1 || n > SCENES.length) return 0;
  return n - 1;
}

function waitForImages(root) {
  const imgs = [...root.querySelectorAll('img')];
  return Promise.all(imgs.map(img => {
    if (img.complete && img.naturalWidth > 0) return Promise.resolve();
    return new Promise(resolve => {
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', resolve, { once: true });
    });
  }));
}

async function renderScene(i) {
  const root = document.getElementById('sceneRoot');
  const hudTL = document.getElementById('hudTL');
  const hudTR = document.getElementById('hudScene');

  hudTL.textContent = 'SYS-41';
  hudTR.textContent = SCENES[i].hud;

  /* билд-номер нигде не показывается — только внутри DOM, для отладки */
  document.documentElement.dataset.build = window.PROTOTYPE_VERSION;

  const refs = SCENES[i].build(root);
  root.classList.add('active');

  const token = ++E.token;
  const ctx = ctxFor(token);
  try {
    await SCENES[i].play(ctx, refs);
  } catch (e) {
    if (e !== SKIP) console.error(e);
  }

  await waitForImages(root);
  if (document.fonts && document.fonts.ready) await document.fonts.ready;

  document.documentElement.dataset.printReady = 'true';
}

renderScene(sceneIndexFromURL());
