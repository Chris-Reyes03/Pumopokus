import { useEffect } from 'react'

const INTERACTIVE_SELECTOR =
  'input, textarea, select, button, a, [contenteditable="true"], [role="slider"], [role="switch"], [role="group"]'

export function useSpacebar(onToggle, enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined

    const handleKeyDown = (event) => {
      if (
        event.code !== 'Space' ||
        event.repeat ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      ) {
        return
      }
      if (event.target instanceof Element && event.target.closest(INTERACTIVE_SELECTOR)) return

      event.preventDefault()
      onToggle()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled, onToggle])
}
