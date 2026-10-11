"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const currentTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    setTheme(currentTheme);

    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystemTheme = () => {
      try {
        if (window.localStorage.getItem("portfolio-theme")) return;
      } catch {
        // Fall back to the live system preference when storage is unavailable.
      }
      const nextTheme: Theme = systemTheme.matches ? "dark" : "light";
      document.documentElement.dataset.theme = nextTheme;
      document.documentElement.style.colorScheme = nextTheme;
      setTheme(nextTheme);
    };
    systemTheme.addEventListener("change", syncSystemTheme);
    return () => systemTheme.removeEventListener("change", syncSystemTheme);
  }, []);

  function toggleTheme() {
    const currentTheme: Theme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    const nextTheme: Theme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    try {
      window.localStorage.setItem("portfolio-theme", nextTheme);
    } catch {
      // Keep the in-memory theme toggle working when storage is unavailable.
    }
    setTheme(nextTheme);
  }

  const nextTheme = theme === "dark" ? "light" : "dark";
  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} mode`}
      aria-pressed={theme === "dark"}
      title={`Switch to ${nextTheme} mode`}
    >
      <span className="theme-toggle-thumb" aria-hidden="true" />
      <Sun className="theme-toggle-icon theme-toggle-sun" size={14} strokeWidth={2} aria-hidden="true" />
      <Moon className="theme-toggle-icon theme-toggle-moon" size={13} strokeWidth={2} aria-hidden="true" />
    </button>
  );
}
