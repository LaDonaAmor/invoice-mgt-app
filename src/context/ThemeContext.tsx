import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type Theme = "light" | "dark";

interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const initial: Theme =
    typeof window !== "undefined" &&
    window.matchMedia("prefers-color-scheme: dark").matches
      ? "dark"
      : "light";

  const [theme, setTheme] = useLocalStorage<Theme>("invoicely-theme", initial);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <Ctx.Provider
      value={{
        theme,
        toggle: () => setTheme(theme === "dark" ? "light" : "dark"),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
}
