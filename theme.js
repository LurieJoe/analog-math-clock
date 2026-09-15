(() => {
  let saved = "system";
  try {
    saved = localStorage.getItem("equation-clock-theme") || "system";
  } catch {
    // The app will show a storage warning after it loads.
  }
  const param = new URLSearchParams(window.location.search).get("clawpilotTheme");
  const preference = param || saved;
  const theme =
    preference === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : preference;
  document.documentElement.setAttribute("data-theme", theme);
})();
