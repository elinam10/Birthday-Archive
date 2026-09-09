const bootLines = [
  "ACCESSING PERSONAL ARCHIVE... ACCEPTED",
  "YEAR: 2025–2026... ACCEPTED",
  "DATA FOUND: 87%... PARTIAL",
  "SUBJECT IDENTIFIED... ACCEPTED",
];

const boot = document.querySelector("#boot");
const desktop = document.querySelector("#desktop");
const screen = document.querySelector("#screen");
const startButton = document.querySelector("#startButton");
const bootLog = document.querySelector("#bootLog");
const scenes = [...document.querySelectorAll(".scene")];
const dockItems = [...document.querySelectorAll(".dock__item")];
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const playButton = document.querySelector("#playButton");
const sceneCounter = document.querySelector("#sceneCounter");
const timelineProgress = document.querySelector("#timelineProgress");
const terminalTrace = document.querySelector("#terminalTrace");

let sceneIndex = 0;
let isPlaying = true;
let sceneTimer;
let updateTimer;

function typeBootLine(index = 0) {
  if (index >= bootLines.length) return;
  const line = document.createElement("p");
  bootLog.appendChild(line);
  let character = 0;
  const typing = window.setInterval(() => {
    line.textContent += bootLines[index][character++] ?? "";
    if (character > bootLines[index].length) {
      window.clearInterval(typing);
      window.setTimeout(() => typeBootLine(index + 1), 160);
    }
  }, 22);
}

function launch() {
  const music = document.querySelector("#prototypeMusic");
  if (music && music.paused && music.currentTime === 0) music.play().catch(() => {});
  screen.classList.add("is-starting");
  window.setTimeout(() => {
    boot.hidden = true;
    desktop.hidden = false;
    screen.classList.remove("is-starting");
    showScene(0);
  }, 520);
}

function showScene(index, restartTimer = true) {
  sceneIndex = (index + scenes.length) % scenes.length;
  scenes.forEach((scene, i) => scene.classList.toggle("is-visible", i === sceneIndex));
  dockItems.forEach((item, i) => item.classList.toggle("is-active", i === sceneIndex));
  sceneCounter.textContent = `${String(sceneIndex + 1).padStart(2, "0")} / ${String(scenes.length).padStart(2, "0")}`;
  timelineProgress.style.width = `${((sceneIndex + 1) / scenes.length) * 100}%`;
  terminalTrace.textContent = `> OPENING ${scenes[sceneIndex].querySelector(".window__bar span").textContent.toUpperCase()}`;

  if (sceneIndex === 3) animateCounters();
  if (sceneIndex === 4) animateUpdate();
  if (restartTimer) scheduleNext();
}

function scheduleNext() {
  window.clearTimeout(sceneTimer);
  if (!isPlaying) return;
  sceneTimer = window.setTimeout(() => showScene(sceneIndex + 1), sceneIndex === 4 ? 11000 : 7500);
}

function animateCounters() {
  document.querySelectorAll("[data-count]").forEach((element) => {
    const target = Number(element.dataset.count);
    const started = performance.now();
    const duration = 1300;
    const tick = (now) => {
      const progress = Math.min((now - started) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased).toLocaleString("en-US");
      if (progress < 1 && sceneIndex === 3) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

function animateUpdate() {
  window.clearInterval(updateTimer);
  const bar = document.querySelector("#progressBar");
  const value = document.querySelector("#progressValue");
  const success = document.querySelector("#updateSuccess");
  let progress = 0;
  bar.style.width = "0";
  value.textContent = "0%";
  success.classList.remove("is-visible");
  updateTimer = window.setInterval(() => {
    progress = Math.min(progress + Math.ceil(Math.random() * 9), 100);
    bar.style.width = `${progress}%`;
    value.textContent = `${progress}%`;
    if (progress === 100) {
      window.clearInterval(updateTimer);
      window.setTimeout(() => success.classList.add("is-visible"), 450);
    }
  }, 130);
}

startButton.addEventListener("click", launch);
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !boot.hidden) launch();
  if (!desktop.hidden && event.key === "ArrowRight") showScene(sceneIndex + 1);
  if (!desktop.hidden && event.key === "ArrowLeft") showScene(sceneIndex - 1);
  if (!desktop.hidden && event.key === " ") {
    event.preventDefault();
    togglePlayback();
  }
});
dockItems.forEach((item) => item.addEventListener("click", () => showScene(Number(item.dataset.scene))));
prevButton.addEventListener("click", () => showScene(sceneIndex - 1));
nextButton.addEventListener("click", () => showScene(sceneIndex + 1));
playButton.addEventListener("click", togglePlayback);

function togglePlayback() {
  isPlaying = !isPlaying;
  playButton.textContent = isPlaying ? "Ⅱ" : "▶";
  playButton.setAttribute("aria-label", isPlaying ? "Pause automatic playback" : "Resume automatic playback");
  scheduleNext();
}

document.querySelector("#clock").textContent = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit", month: "2-digit", year: "numeric"
}).format(new Date(2026, 8, 19));

typeBootLine();
