import { createEffect, createSignal } from "solid-js";
import styles from "../App.module.css";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = createSignal<Theme>(
    (() => {
      // Check localStorage first
      const savedTheme = localStorage.getItem("theme") as Theme | null;
      if (savedTheme === "light" || savedTheme === "dark") return savedTheme;

      // Check system preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
      return "light";
    })()
  );

  // Update data-theme attribute when theme changes
  createEffect(() => {
    document.documentElement.setAttribute("data-theme", theme());
    localStorage.setItem("theme", theme());
  });

  // Listen for system theme changes
  createEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <button
      class={styles.themeToggle}
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme() === "light" ? "🌙" : "☀️"}
    </button>
  );
}
