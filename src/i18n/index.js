import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { useSettingsStore } from '../store/settingsStore'
import en from './en.json'
import fil from './fil.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fil: { translation: fil },
  },
  lng: useSettingsStore.getState().language,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnNull: false,
  react: { useSuspense: false },
})

export default i18n
