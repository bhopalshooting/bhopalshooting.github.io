import { useCallback, useEffect, useRef, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

const THEME_COLOR: Record<Theme, string> = {
  dark: '#0e0f11',
  light: '#e8e6e1',
}

function activeTheme(): Theme {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

function storedTheme(): Theme | null {
  if (typeof localStorage === 'undefined') return null
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(activeTheme)
  const chosen = useRef(storedTheme() !== null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme])

    if (!chosen.current) return
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Safari private mode throws on write. The theme still applies for this visit.
    }
  }, [theme])

  // Until the reader picks a side, stay with the system.
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = (e: MediaQueryListEvent) => {
      if (!chosen.current) setTheme(e.matches ? 'light' : 'dark')
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const toggle = useCallback(() => {
    chosen.current = true
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  return { theme, toggle }
}
