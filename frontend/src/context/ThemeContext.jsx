import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

const STORAGE_KEY = "smartroad-theme"
const THEMES = ["light", "dark", "system"]

const ThemeContext = createContext(null)

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      return THEMES.includes(stored) ? stored : "dark"
    } catch {
      return "dark"
    }
  })

  const applyTheme = useCallback((nextTheme) => {
    const resolved = nextTheme === "system" ? getSystemTheme() : nextTheme
    document.documentElement.classList.toggle("dark", resolved === "dark")
    document.documentElement.classList.toggle("light", resolved === "light")
    document.documentElement.style.colorScheme = resolved
  }, [])

  useEffect(() => {
    applyTheme(theme)
  }, [theme, applyTheme])

  useEffect(() => {
    if (theme !== "system") return undefined
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => applyTheme("system")
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [theme, applyTheme])

  const setTheme = useCallback((nextTheme) => {
    if (!THEMES.includes(nextTheme)) return
    try {
      window.localStorage.setItem(STORAGE_KEY, nextTheme)
    } catch {
      /* storage unavailable — theme still applies for this session */
    }
    setThemeState(nextTheme)
  }, [])

  const value = useMemo(() => {
    const resolvedTheme = theme === "system" ? getSystemTheme() : theme
    return { theme, resolvedTheme, setTheme }
  }, [theme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
