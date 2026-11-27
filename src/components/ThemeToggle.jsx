import { useTranslation } from 'react-i18next'
import { useResolvedTheme } from '../hooks/useTheme'
import { useSettingsStore } from '../store/settingsStore'
import { MoonIcon, SunIcon } from './icons'

export default function ThemeToggle() {
  const { t } = useTranslation()
  const theme = useSettingsStore((state) => state.theme)
  const setTheme = useSettingsStore((state) => state.setTheme)
  const resolvedTheme = useResolvedTheme(theme)

  const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
  const label = t('header.switchTheme', { theme: t(`theme.${nextTheme}`) })

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      aria-label={label}
      title={label}
      className="grid size-9 place-items-center rounded-full bg-black/15 text-on-page transition-colors duration-150 hover:bg-black/25"
    >
      {resolvedTheme === 'dark' ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
    </button>
  )
}
