import { useCallback, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

export type Theme = 'light' | 'dark'

const systemTheme = (): Theme =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

export function useTheme() {
  const [stored, setStored] = useLocalStorage<Theme | null>('cookify:theme', null)
  const theme: Theme = stored ?? systemTheme()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#111827' : '#F97316')
  }, [theme])

  // Volg de systeeminstelling zolang de gebruiker geen eigen keuze heeft gemaakt.
  useEffect(() => {
    if (stored) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => document.documentElement.setAttribute('data-theme', mq.matches ? 'dark' : 'light')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [stored])

  const toggle = useCallback(() => setStored(theme === 'dark' ? 'light' : 'dark'), [theme, setStored])
  return { theme, toggle }
}
