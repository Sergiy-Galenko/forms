import { createContext, useContext, useEffect, useState } from "react";
const ThemeContext = createContext();
export const THEME_KEY = "formscraft:appearance:v1";
export const useTheme = () => useContext(ThemeContext);
function preference() {
  try {
    const saved =
      localStorage.getItem(THEME_KEY) || localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch {}
  return null;
}
const system = () =>
  window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
export function ThemeProvider({ children }) {
  const [choice, setChoice] = useState(preference);
  const [systemTheme, setSystemTheme] = useState(system);
  const theme = choice || systemTheme;
  useEffect(() => {
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    const change = () => setSystemTheme(system());
    media?.addEventListener?.("change", change);
    return () => media?.removeEventListener?.("change", change);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  const setTheme = (value) => {
    setChoice(value);
    try {
      if (value) localStorage.setItem(THEME_KEY, value);
      else localStorage.removeItem(THEME_KEY);
    } catch {}
  };
  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme: () => setTheme(theme === "light" ? "dark" : "light"),
        setLightTheme: () => setTheme("light"),
        setDarkTheme: () => setTheme("dark"),
        isDark: theme === "dark",
        isLight: theme === "light",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
