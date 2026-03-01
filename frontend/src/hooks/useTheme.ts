import { useEffect, useState } from 'react'

export type ThemeMode = 'light' | 'dark'

const THEME_STORAGE_KEY = 'theme'

const normalizeTheme = (value: string | null): ThemeMode => (value === 'dark' ? 'dark' : 'light')

const applyThemeClass = (theme: ThemeMode) => {
  const root = document.documentElement
  root.classList.remove('theme-light', 'theme-dark')
  root.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light')
}

export const useTheme = () => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(THEME_STORAGE_KEY) : null
    return normalizeTheme(stored)
  })

  useEffect(() => {
    applyThemeClass(theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const setTheme = (nextTheme: ThemeMode) => {
    setThemeState(nextTheme)
  }

  const toggleTheme = () => {
    setThemeState((current) => (current === 'light' ? 'dark' : 'light'))
  }

  return {
    theme,
    setTheme,
    toggleTheme,
  }
}
