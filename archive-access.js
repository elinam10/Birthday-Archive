(() => {
  if (sessionStorage.getItem("birthdayArchiveAccess") !== "granted") {
    document.documentElement.style.visibility = "hidden";
    window.location.replace(new URL("../", window.location.href).href);
  }
})();
