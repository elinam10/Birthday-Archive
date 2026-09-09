#!/usr/bin/env node
/* =========================================================================
   Exports every scene of the Birthday Archive print edition to its own
   single-page, 210x125mm PDF: pdf/01.pdf, pdf/02.pdf, ... pdf/NN.pdf.

   The number of scenes is read from the running page itself (SCENES.length,
   the exact same array the web version renders from) rather than a
   hardcoded count, so this script automatically tracks the real content of
   scenes.js.

   Usage:  npm run export:pdf   (from prototype-3-print/export/)
   ========================================================================= */
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRINT_ROOT = path.resolve(__dirname, '..');
const INDEX_FILE = path.join(PRINT_ROOT, 'index.html');
const OUT_DIR = path.join(PRINT_ROOT, 'pdf');

const MM = { width: '210mm', height: '125mm' };
/* 96 CSS px per inch, 1in = 25.4mm -- matches the viewport to the physical
   page size 1:1 so on-screen layout and the printed PDF agree exactly. */
const VIEWPORT = {
  width: Math.round((210 / 25.4) * 96),
  height: Math.round((125 / 25.4) * 96),
};

async function main() {
  if (!fs.existsSync(INDEX_FILE)) {
    throw new Error('index.html not found at ' + INDEX_FILE);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEWPORT });

  const fileUrl = 'file://' + INDEX_FILE;

  // Discover the real scene count from the page itself (scene 1, arbitrarily).
  await page.goto(fileUrl + '?scene=1', { waitUntil: 'load' });
  const sceneCount = await page.evaluate(() => SCENES.length);
  console.log('Found', sceneCount, 'scenes in scenes.js');

  for (let i = 1; i <= sceneCount; i++) {
    const n = String(i).padStart(2, '0');
    console.log('Rendering scene', n, '...');
    await page.goto(fileUrl + '?scene=' + i, { waitUntil: 'load' });
    await page.waitForFunction(
      () => document.documentElement.dataset.printReady === 'true',
      { timeout: 30000 }
    );
    // one extra frame so the very last paint (fonts/images already awaited
    // in print-app.js) is definitely flushed before the PDF snapshot
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));

    const outFile = path.join(OUT_DIR, n + '.pdf');
    await page.pdf({
      path: outFile,
      width: MM.width,
      height: MM.height,
      printBackground: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      displayHeaderFooter: false,
      preferCSSPageSize: false,
    });
    console.log('  ->', path.relative(PRINT_ROOT, outFile));
  }

  await browser.close();
  console.log('Done:', sceneCount, 'PDF(s) written to', path.relative(PRINT_ROOT, OUT_DIR) + '/');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
