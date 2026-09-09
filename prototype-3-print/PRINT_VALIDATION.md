# Print Validation Report

Generated for the `pdf/` output of `prototype-3-print`, produced by
`export/export-pdf.mjs` (Playwright + Chromium). Every check below was run
against the actual exported files, not just eyeballed against the source.

## 1. Scene / PDF count

`scenes.js` currently defines **10 scenes** (`SCENES.length === 10`, read
live from the page by the export script, not hardcoded). **10 PDFs** were
produced: `01.pdf` … `10.pdf`, one per scene, in source order:

| PDF | Scene (`C.menu`) |
|-----|-------------------|
| 01.pdf | ACCESSING PERSONAL ARCHIVE |
| 02.pdf | LIMITED DATA / THE OBSERVER |
| 03.pdf | SUBJECT CARD |
| 04.pdf | 12 MONTHS OF VERSION 41.0 |
| 05.pdf | PEOPLE AND CONNECTIONS |
| 06.pdf | KNOWN LOCATIONS |
| 07.pdf | JOSE'S LEGACY FEATURES |
| 08.pdf | CORE CHARACTER |
| 09.pdf | NUMBERS & STATISTICS |
| 10.pdf | ARCHIVE / VERSION 42.0 |

(The original project briefly had an 11th "data recovery" scene; it was
removed from `scenes.js` — and therefore from the web version too — before
this print work started, at the user's request in this same session. There
is no scene 11 to carry over.)

## 2. Page count and physical size

Checked with `pdfinfo` on every file:

- **Pages: 1** for all 10 PDFs — confirmed individually, not assumed.
- **Page size: 595.92 × 354.96 pt** for all 10 PDFs, identical across the
  set (so nothing shifts size page to page).

Converted to mm: **210.23 × 125.22mm** — a consistent ~0.23mm oversize
against the nominal 210 × 125mm on both dimensions. This was traced to
Chromium's own PDF engine (reproduced identically via a raw CDP
`Page.printToPDF` call, bypassing Playwright entirely, and identically
whether the requested size is given in `mm` or `in`) — Chromium snaps the
requested paper size to its internal print raster before laying out the
page. It is not something fixable from the page/script side. At ~0.23mm
(under a quarter of a millimetre) it is imperceptible and well inside
normal print/cutting tolerance, and — critically — it is the *same* on
every page, so relative composition between pages is unaffected.

## 3. Content — text, photos, order, composition

Every page was rendered to a 150dpi PNG (`pdftoppm`) and visually reviewed:

- All body text from `content.js` present on the expected scene, with no
  copy changes.
- All photos present, in full color (see §5).
- Scene order matches the table in §1 exactly, 1 → 10, no gaps or repeats.
- Every scene uses the same fixed contain-and-center transform (a single
  hardcoded `translate(5mm, 6.25mm) scale(0.472441)` in `print.css`, not
  computed per scene), so the composition sits at the same size and
  position on every page — confirmed visually across all 10 renders.
- Frame corner brackets and the top/bottom HUD labels sit consistently
  inside a safe margin on every page; no text, photo or line touches the
  physical page edge on any of the 10 pages.
- No cropped/clipped content: the densest scene (04, twelve month-cards in
  a 6×2 grid) was the main risk here — it initially DID overflow the page
  (see §7, "issue found and fixed") and was re-verified after the fix.

## 4. Print palette

`print.css` sets the six specified colors as the page's design tokens
(`--bg #F1F3EC`, `--g-bright #173C2A`, `--g #294B38`, `--g-mid #2B6747`,
`--g-dim #536A5B`, `--line #607B69`), and every hardcoded rgba tint in the
copied `styles.css` that referenced the old dark-theme greens/red/amber was
rewritten in place to the matching print color at its original alpha (see
`README.md` for the exact list). Spot-checked visually on all 10 renders:
cream background throughout, dark-green headings/body text, muted-green
borders and rules, no leftover near-black or bright neon-green anywhere.

Three semantic accents that exist in the content but weren't in the six
specified colors — the red "DENIED"/alert color, the amber "coffee"
highlight, and the blue Optimus-Poker-logo fallback — were darkened for
legibility on the light background (e.g. the original `#ff5d47` red is a
light coral that would be nearly illegible on `#F1F3EC`; it's `#963320` in
print). This wasn't in the brief's six colors explicitly, so it's called
out here as a judgment call rather than left unmentioned.

## 5. Photos vs. technical images

- **Photos of people/places** (portraits, family/friends/colleagues,
  Torremolinos beach, the boat license photo, Rick & Morty poster, etc.)
  are untouched — full color, no grayscale, no duotone, no CRT tint. This
  required overriding two things the web version applies for visual style:
  the green multiply-tint overlay on `.photo` elements, and the
  `grayscale(1)` filter the "biometric scan" portrait (Scene 3) had over
  the actual photo — both removed for print, confirmed visually on Scene 3
  and Scene 8's portraits.
- **The Málaga map** (Scene 6) — the one raster "technical image" in the
  project (a map outline PNG plus five POI pin+label PNG cutouts) — was
  recolored pixel-by-pixel (`recolor-malaga.py`) from its original
  neon-green-on-black rendering to the print palette (`#F1F3EC` background,
  `#607B69` outline, `#173C2A` pin/label text), so it now reads as part of
  the same light print system as the rest of Scene 6 rather than as a
  leftover dark-mode asset. It is the only raster image whose colors were
  altered; every photograph of a person or place keeps its original colors.

## 6. Image resolution vs. 300dpi target

Measured directly (not estimated): for every `<img>` in every scene, actual
rendered CSS box size at print scale vs. the source file's native pixel
size, converted to an effective dpi.

**Result: every photo in every scene meets or exceeds 300dpi** — the lowest
value found across the whole project is ~391dpi (`s5-friends-2.jpg`, one
axis, in the small Scene 5 friendship collage), and most are 600–3000+dpi
(the source photos are all phone-camera resolution or higher, displayed at
modest sizes within the 1600×900 canvas). No image needed upscaling, and
none is flagged as under the 300dpi target — there is nothing to report as
a shortfall here.

## 7. Issue found during validation, and the fix

The first export pass had Scene 4 (and only Scene 4, because it's the only
scene whose grid genuinely needs its full 900px of canvas height) overflow
its page: the twelve month-cards spilled past the bottom of the printed
area instead of being contained in a 2×6 grid.

Root cause: `styles.css` has a `@media (max-width:900px)` block that
switches the *web* version into a stacked mobile layout (full-width
`#stage`, `.scene` back in normal document flow, single-column grids,
etc.). The print page's own content box is 210mm ≈ 793.7 CSS px wide at
the standard 96dpi reference — under that 900px breakpoint — so this
phone-layout media query was wrongly firing for print, overriding the
desktop 1600×900 canvas the print transform assumes. Fixed by disabling
that block (and a second, cosmetic one tweaking letter-spacing) in this
copy's `styles.css` only — `prototype-3/styles.css` (the actual web
version) is untouched and keeps its mobile layout for real narrow browser
windows, where it's supposed to trigger.

Re-exported and re-verified after the fix: Scene 4 (`pdf/04.pdf`) now shows
all twelve cards in the intended 6×2 grid, fully inside the page, same
margins as every other scene.

## 8. Fonts

`pdffonts` on the exported PDFs confirms every font is embedded and
subsetted (`emb yes`, `sub yes` on all rows) — Roboto Mono
(regular/bold/italic) plus AppleColorEmoji (color, Type 3 — confirming
emoji embed and render in color, not as monochrome fallback glyphs) and
Menlo as a system fallback for the handful of symbol glyphs Roboto Mono
itself doesn't cover (e.g. ↘, ⚠).

## 9. Other checks run

- No JavaScript console errors or page errors across all 10 scene renders.
- `git status`/`git diff` on the repository confirm `prototype-3/` (the
  original web version) has zero modifications — this work only ever
  touched files inside the new `prototype-3-print/` directory.
- CRT/glow removal verified both by code (a blanket
  `text-shadow/box-shadow/filter/backdrop-filter: none !important` in
  `print.css`, `animation-duration: 0s !important` so animations still
  respect their `forwards`/`backwards` fill state instead of reverting to a
  pre-animation hidden state) and visually — no scanlines, glow halos, or
  mid-animation artifacts on any of the 10 renders.

## Objective limitations to flag

- The ~0.23mm page-size oversize from Chromium's PDF engine, per §2 —
  consistent across all pages, imperceptible, not fixable at this layer.
- The three darkened semantic accent colors (red/amber/blue) in §4 are a
  reasonable extrapolation beyond the six colors specified in the brief,
  not a literal requirement — flagged for the user's awareness/approval
  rather than silently decided.
- (Resolved) An earlier revision of this report noted a pre-existing overlap
  in the original web design between the Scene 3 dinosaur's note text and
  the bottom-left "SYSTEM STATUS: STABLE" HUD label. The print edition no
  longer renders that HUD corner at all (removed at the user's request,
  along with Scene 10's fireworks canvas), so the overlap doesn't occur in
  print. It's unchanged, and still present, in the live web version.
