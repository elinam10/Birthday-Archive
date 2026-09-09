const phases = [
  { name: "IDENTIFICATION", duration: 6500, logs: ["Searching personal archive", "Subject signature detected", "Identity match: 100%", "Profile access accepted"] },
  { name: "VISUAL EVIDENCE", duration: 7000, logs: ["Scanning visual storage", "Photo 01 recovered", "Photo 02 recovered", "Photo 03 recovered", "Photo 04 recovered"] },
  { name: "YEAR RECONSTRUCTION", duration: 6500, logs: ["Reading 12-month record", "Historical gap detected", "Major achievements indexed", "Timeline reconstructed"] },
  { name: "CONNECTIONS", duration: 6000, logs: ["Analyzing social module", "Family link confirmed", "Friendship link confirmed", "Relationship status: MAX"] },
  { name: "STATISTICS", duration: 6500, logs: ["Calculating key statistics", "Coffee amount: critical", "Lifestyle shift detected", "Data confidence: questionable"] },
  { name: "SYSTEM UPDATE", duration: 9000, logs: ["Version 41.0 archived", "Update package located", "Installing positive experiences", "Installing beautiful memories"] },
];

const startScreen = document.querySelector("#startScreen");
const liveStage = document.querySelector("#liveStage");
const phaseElements = [...document.querySelectorAll(".phase")];
const phaseNumber = document.querySelector("#phaseNumber");
const phaseName = document.querySelector("#phaseName");
const systemLog = document.querySelector("#systemLog");
const processProgress = document.querySelector("#processProgress");
let currentPhase = 0;
let phaseTimer;
let logTimers = [];
let updateTimer;

document.querySelector("#startButton").addEventListener("click", startProcess);
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !startScreen.hidden) startProcess();
});

function startProcess() {
  const music = document.querySelector("#prototypeMusic");
  if (music && music.paused && music.currentTime === 0) music.play().catch(() => {});
  startScreen.hidden = true;
  liveStage.hidden = false;
  showPhase(0);
}

function showPhase(index) {
  clearTimeout(phaseTimer);
  logTimers.forEach(clearTimeout);
  clearInterval(updateTimer);
  currentPhase = index % phases.length;
  const config = phases[currentPhase];
  phaseElements.forEach((phase, i) => phase.classList.toggle("is-active", i === currentPhase));
  phaseNumber.textContent = String(currentPhase + 1).padStart(2, "0");
  phaseName.textContent = config.name;
  processProgress.style.width = `${((currentPhase + 1) / phases.length) * 100}%`;
  addLogs(config.logs);
  if (currentPhase === 1) animatePhotoCount();
  if (currentPhase === 4) animateNumbers();
  if (currentPhase === 5) animateUpdate();
  phaseTimer = setTimeout(() => showPhase(currentPhase === phases.length - 1 ? 0 : currentPhase + 1), config.duration);
}

function addLogs(messages) {
  messages.forEach((message, index) => {
    logTimers.push(setTimeout(() => {
      const line = document.createElement("p");
      line.textContent = `${message}${index === messages.length - 1 ? " ✓" : "..."}`;
      if (index === messages.length - 1) line.classList.add("is-ok");
      systemLog.appendChild(line);
      while (systemLog.children.length > 16) systemLog.firstElementChild.remove();
    }, index * 720));
  });
}

function animatePhotoCount() {
  const counter = document.querySelector("#photoCount");
  counter.textContent = "0 / 4";
  [1,2,3,4].forEach((number, index) => logTimers.push(setTimeout(() => counter.textContent = `${number} / 4`, 700 + index * 800)));
}

function animateNumbers() {
  document.querySelectorAll("[data-target]").forEach((element) => {
    const target = Number(element.dataset.target);
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / 1700, 1);
      element.textContent = Math.round(target * (1 - Math.pow(1-progress,3))).toLocaleString("en-US");
      if (progress < 1 && currentPhase === 4) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

function animateUpdate() {
  const bar = document.querySelector("#updateBar");
  const value = document.querySelector("#updateValue");
  const birthday = document.querySelector("#birthday");
  let progress = 0;
  bar.style.width = "0";
  value.textContent = "0%";
  birthday.classList.remove("is-visible");
  updateTimer = setInterval(() => {
    progress = Math.min(progress + Math.ceil(Math.random()*7),100);
    bar.style.width = `${progress}%`;
    value.textContent = `${progress}%`;
    if (progress === 100) {
      clearInterval(updateTimer);
      setTimeout(() => birthday.classList.add("is-visible"),350);
    }
  }, 125);
}

setInterval(() => {
  document.querySelector("#systemTime").textContent = new Date().toLocaleTimeString("en-GB");
}, 1000);
