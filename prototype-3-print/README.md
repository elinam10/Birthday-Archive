# Birthday Archive — Print Edition

A standalone, print-only copy of `prototype-3` (the "Version 41.0 Archive"
terminal presentation). The original web version at `../prototype-3/` is
**not modified** — this folder is a self-contained fork that renders the
exact same 10 scenes, fully settled (no animation), on a light print
palette, one scene per 210×125mm page.

## What's here

```
prototype-3-print/
  index.html          the print page itself: renders exactly one scene,
                       controlled by a ?scene=N query param (1-based)
  print-app.js         bootstraps the single scene, in "instant" mode
  content.js            verbatim copy — all scene text/photo references
  engine.js              verbatim copy — animation helpers, photoSlot, etc.
  scenes.js               verbatim copy — the 10 scene build()/play() functions
  version.js
  styles.css            copy of the web stylesheet, with:
                          - every rgba(78,240,138,X) / rgba(255,93,71,X) /
                            rgba(255,200,90,X) / rgba(53,184,105,X) /
                            rgba(3,13,7,X) triplet rewritten in place to the
                            matching print-palette color at the same alpha
                          - the @media(max-width:900px) mobile layout
                            disabled (see print.css and the comment at that
                            rule) — it otherwise wrongly triggers because
                            210mm is under 900 CSS px at 96dpi
  print.css              the print palette (CSS custom properties), a
                          blanket removal of glow/shadow/blur/scanline
                          effects, the few hardcoded-hex one-offs styles.css
                          doesn't route through a variable, and the fixed
                          210x125mm page + 1600x900 canvas-to-page transform
  fonts/                self-hosted Roboto Mono (woff2, latin subset) so the
                          PDF export never depends on network access
  photos/               copy of ../prototype-3/photos, minus two files that
                          scenes.js no longer references (s11-dawnwalker.jpg,
                          s6-andalucia-map.png), with the 6 Málaga map
                          images (s6-malaga-*.png) recolored to the print
                          palette (see recolor-malaga.py)
  recolor-malaga.py     one-off script that produced the recolored map PNGs
                          above; re-run it only if those source images in
                          ../prototype-3/photos are ever replaced
  export/
    package.json, export-pdf.mjs   the Playwright export script
  pdf/                   output — 01.pdf .. NN.pdf, one per scene
  PRINT_VALIDATION.md   the validation report for the current pdf/ output
```

## How rendering works

`scenes.js`/`engine.js` are untouched, so `print-app.js` reuses the exact
mechanism the web app already uses for its "jump to scene" shortcut: it
sets `E.instant = true`, which makes every `ctx.wait()` in a scene's
`play()` resolve immediately (see `ctxFor()` in `engine.js`). The scene's
full reveal timeline still runs, in order, with every DOM mutation it would
normally make — it just does it without the real-time delays, so the page
lands on exactly the same final, fully-revealed state the live presentation
reaches at the end of that scene.

Scene 10's live canvas fireworks effect has no defined "final frame" by
design (it's a `requestAnimationFrame` particle loop), so it's hidden
outright for print (`#fireworks{ display:none }` in `print.css`) rather
than captured mid-burst.

Every scene is authored on the same fixed 1600×900 design canvas the web
version uses (`#stage` in `styles.css`). `print.css` scales that canvas by
a single constant factor (`0.472441`, i.e. `200mm / 423.333mm`) so it fits
uniformly — same scale, same centering, every scene — inside a 200×115mm
area with a 5mm safe margin on all sides of the 210×125mm page. Nothing is
cropped or stretched; a scene that doesn't fill the full aspect ratio just
letterboxes onto the page background.

## Previewing a scene in a browser

Serve this directory (or the whole repo) over HTTP — `file://` also works,
Playwright uses it directly — and open:

```
index.html?scene=1     … through …     index.html?scene=10
```

Quick local server if you don't have one running:

```bash
cd prototype-3-print
python3 -m http.server 4173
# then open http://localhost:4173/index.html?scene=1
```

## Exporting the PDFs

```bash
cd prototype-3-print/export
npm install                    # installs Playwright (one-time)
npx playwright install chromium  # downloads the Chromium binary (one-time)
npm run export:pdf
```

This regenerates every file in `../pdf/` from scratch. The scene count is
read from the live page (`SCENES.length`), not hardcoded, so if a scene is
ever added or removed from `scenes.js` the exported PDF set automatically
tracks it — re-run the same command, nothing else to update.

## Known, accepted limitation

Chromium's PDF engine rounds the requested physical page size to its own
internal print raster; the resulting MediaBox is consistently
210.23 × 125.22mm instead of a mathematically exact 210.00 × 125.00mm (a
~0.23mm oversize on each dimension, confirmed the same whether the size is
requested in mm or in, and whether through Playwright's API or a raw CDP
`Page.printToPDF` call — it's inherent to Chromium, not fixable from here).
It is identical and consistent across all 10 pages. See
`PRINT_VALIDATION.md` for the full validation report.
