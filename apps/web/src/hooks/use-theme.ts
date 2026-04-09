import { useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

function useTheme() {
  const [theme, setTheme] = useState<Theme>('system')

  useEffect(() => {
    const root = window.document.documentElement
    const stored = window.localStorage.getItem('theme') as Theme | null

    if (stored) {
      setTheme(stored)
      root.classList.remove('light', 'dark')
      root.classList.add(stored === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : stored)
    }
  }, [])

  const setThemeValue = (newTheme: Theme) => {
    const root = window.document.documentElement
    setTheme(newTheme)
    window.localStorage.setItem('theme', newTheme)
    root.classList.remove('light', 'dark')
    root.classList.add(newTheme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : newTheme)
  }

  return { theme, setTheme: setThemeValue }
}

export { useTheme }
export type { Theme }
