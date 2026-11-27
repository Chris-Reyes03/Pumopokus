import { useTranslation } from 'react-i18next'
import { useSettingsStore } from '../store/settingsStore'

const LABEL_KEYS = {
  en: 'language.english',
  fil: 'language.filipino',
}

export default function LanguageToggle() {
  const { t } = useTranslation()
  const language = useSettingsStore((state) => state.language)
  const setLanguage = useSettingsStore((state) => state.setLanguage)

  return (
    <div
      role="group"
      aria-label={t('language.label')}
      className="flex items-center rounded-full bg-black/15 p-0.5"
    >
      {['en', 'fil'].map((value) => {
        const active = value === language
        return (
          <button
            key={value}
            type="button"
            onClick={() => setLanguage(value)}
            aria-pressed={active}
            title={t(LABEL_KEYS[value])}
            className={`rounded-full px-2 py-1.5 text-[11px] font-bold tracking-wide transition-colors duration-150 sm:px-2.5 ${
              active ? 'bg-black/30 text-on-page' : 'text-on-page-muted hover:text-on-page'
            }`}
          >
            {t(`language.short.${value}`)}
          </button>
        )
      })}
    </div>
  )
}
