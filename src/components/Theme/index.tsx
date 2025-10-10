import * as React from "react";

export type Theme = "light" | "dark";

export const ThemeContext = React.createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({ theme: "light", setTheme: () => {} });

export function ThemeProvider({
  value,
  initial = "light",
  attribute = "data-theme",
  storageKey = "softbot-ui-theme",
  children,
}: {
  value?: Theme;
  initial?: Theme;
  attribute?: "data-theme" | "class";
  storageKey?: string;
  children: React.ReactNode;
}) {
  const [theme, setTheme] = React.useState<Theme>(() => {
    if (value) return value;
    const saved =
      typeof window !== "undefined" ? (localStorage.getItem(storageKey) as Theme | null) : null;
    return saved ?? initial;
  });

  // Si cambia "value" desde fuera (Storybook), sincroniza el estado
  React.useEffect(() => {
    if (value) setTheme(value);
  }, [value]);

  React.useEffect(() => {
    const root = document.documentElement;
    if (attribute === "class") {
      root.classList.remove("light", "dark");
      root.classList.add(theme);
    } else {
      root.setAttribute("data-theme", theme);
    }
    localStorage.setItem(storageKey, theme);
  }, [theme, attribute, storageKey]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
