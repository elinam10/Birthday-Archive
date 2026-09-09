(() => {
  const storageKey = "birthday-archive-muted";
  const button = document.createElement("button");
  const style = document.createElement("style");

  style.textContent = `
    .global-audio-toggle {
      position: fixed;
      top: 48px;
      right: 18px;
      z-index: 100;
      min-width: 92px;
      padding: 9px 11px;
      border: 1px solid rgba(114, 244, 154, .35);
      color: #72f49a;
      background: rgba(2, 8, 4, .88);
      font: 8px "Courier New", monospace;
      letter-spacing: .12em;
      cursor: pointer;
      backdrop-filter: blur(7px);
      -webkit-backdrop-filter: blur(7px);
    }
    .global-audio-toggle:hover,
    .global-audio-toggle:focus-visible {
      border-color: #72f49a;
      outline: none;
      box-shadow: 0 0 18px rgba(114, 244, 154, .12);
    }
    .global-audio-toggle.is-muted {
      color: #758078;
      border-color: rgba(117, 128, 120, .3);
    }
    @media (max-width: 620px) {
      .global-audio-toggle { top: 38px; right: 10px; min-width: 78px; }
    }
  `;

  button.className = "global-audio-toggle";
  button.type = "button";
  button.setAttribute("aria-label", "Mute all sounds");

  function isMuted() {
    return localStorage.getItem(storageKey) === "true";
  }

  function applyMuted(muted) {
    document.querySelectorAll("audio, video").forEach((media) => {
      media.muted = muted;
    });
    button.classList.toggle("is-muted", muted);
    button.textContent = muted ? "🔇 SOUND OFF" : "🔊 SOUND ON";
    button.setAttribute("aria-label", muted ? "Enable all sounds" : "Mute all sounds");
  }

  button.addEventListener("click", () => {
    const muted = !isMuted();
    localStorage.setItem(storageKey, String(muted));
    applyMuted(muted);
  });

  document.head.appendChild(style);
  document.body.appendChild(button);
  applyMuted(isMuted());

})();
