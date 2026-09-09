/* Print-only dossier cover. Never inserted into the web SCENES array. */
const PRINT_PAGES = [
  { title: 'BIRTHDAY ARCHIVE / CASE FILE', cover: true },
  ...SCENES.map((scene, index) => ({ title: C.menu[index], sceneIndex: index }))
];

function buildPrintCover(root) {
  root.className = 'scene print-cover active';
  root.innerHTML = `
    <div class="cover-heading">
      <div class="sc-sub">CASE NO. 042 · PERSONAL RECORD</div>
      <h1 class="sc-title">BIRTHDAY ARCHIVE</h1>
      <div class="sc-rule in"></div>
    </div>
    <div class="cover-body">
      <div class="cover-identity">
        <div class="sc-sub">CASE FILE</div>
        <h2>JOSÉ ANTONIO</h2>
        <div class="cover-version">// 42.0</div>
        <div class="cover-stamp">DECLASSIFIED</div>
      </div>
      <dl class="cover-metadata">
        <div><dt>SUBJECT</dt><dd>JOSÉ ANTONIO</dd></div>
        <div><dt>FILE TYPE</dt><dd>PERSONAL ARCHIVE</dd></div>
        <div><dt>DATE</dt><dd>19.09.2026</dd></div>
        <div><dt>VERSION</dt><dd>42.0</dd></div>
        <div><dt>STATUS</dt><dd>DECLASSIFIED</dd></div>
        <div><dt>ACCESS</dt><dd>AUTHORIZED</dd></div>
      </dl>
    </div>
    <div class="cover-footer">
      <div class="cover-description"><div class="sc-sub">THIS FILE CONTAINS</div>
        <p>CLASSIFIED MEMORIES,<br>DOCUMENTED EVIDENCE<br>&amp; QUESTIONABLE STATISTICS.</p>
      </div>
      <div class="cover-open">OPEN FILE →</div>
    </div>`;
}
