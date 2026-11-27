import { useEffect } from 'react'
import i18n from '../i18n'
import { useSettingsStore } from '../store/settingsStore'

export function useLanguage() {
  const language = useSettingsStore((state) => state.language)

  useEffect(() => {
    i18n.changeLanguage(language)
    document.documentElement.lang = language
  }, [language])
}
