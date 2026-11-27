import { useSyncExternalStore } from 'react'

function subscribe(callback) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => undefined
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}

function getSnapshot() {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useResolvedTheme(theme) {
  const systemTheme = useSyncExternalStore(subscribe, getSnapshot, () => 'light')
  return theme === 'system' ? systemTheme : theme
}
