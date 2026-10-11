(() => {
  const themeButton = document.querySelector(".theme-toggle");
  const root = document.documentElement;
  const applyTheme = (theme, persist) => {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    if (themeButton) {
      const next = theme === "dark" ? "light" : "dark";
      themeButton.setAttribute("aria-label", `Switch to ${next} mode`);
      themeButton.setAttribute("aria-pressed", String(theme === "dark"));
      themeButton.title = `Switch to ${next} mode`;
    }
    if (persist) { try { localStorage.setItem("portfolio-theme", theme); } catch { /* Storage may be unavailable for file URLs. */ } }
  };
  if (themeButton) {
    let saved = null;
    try { saved = localStorage.getItem("portfolio-theme"); } catch { /* Use system preference when storage is unavailable. */ }
    applyTheme(saved === "dark" || saved === "light" ? saved : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"), false);
    themeButton.addEventListener("click", () => applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true));
  }

  const button = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#site-navigation");

  if (!button || !navigation) return;
  document.documentElement.classList.add("has-menu-script");

  const setOpen = (open) => {
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    navigation.classList.toggle("is-open", open);
  };

  button.addEventListener("click", () => {
    setOpen(button.getAttribute("aria-expanded") !== "true");
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      button.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 700) setOpen(false);
  });
})();
