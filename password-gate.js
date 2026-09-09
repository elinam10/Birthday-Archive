(() => {
  const gate = document.querySelector("#accessGate");
  const windowElement = gate.querySelector(".access-window");
  const form = document.querySelector("#accessForm");
  const input = document.querySelector("#accessCode");
  const message = document.querySelector("#accessMessage");
  const selector = document.querySelector("#selector");
  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "").slice(0, 4);
    message.textContent = "STATUS: WAITING FOR INPUT";
    message.className = "";
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (input.value !== "0000") {
      message.textContent = "STATUS: ACCESS DENIED — INVALID CODE";
      message.className = "is-error";
      windowElement.classList.remove("is-error");
      void windowElement.offsetWidth;
      windowElement.classList.add("is-error");
      input.value = "";
      input.focus();
      return;
    }
    message.textContent = "STATUS: ACCESS GRANTED ✓";
    message.className = "is-success";
    input.disabled = true;
    selector.classList.add("is-authorized");
    window.setTimeout(() => gate.classList.add("is-granted"), 420);
    window.setTimeout(() => gate.hidden = true, 1050);
  });
})();
