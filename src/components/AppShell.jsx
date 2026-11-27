import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useLanguage } from '../hooks/useLanguage'
import { useResolvedTheme } from '../hooks/useTheme'
import { useTimer } from '../hooks/useTimer'
import { useSettingsStore } from '../store/settingsStore'
import { useTimerStore } from '../store/timerStore'
import Header from './Header'
import RewardModal from './RewardModal'
import SettingsModal from './settings/SettingsModal'

export default function AppShell() {
  const { t } = useTranslation()
  const mode = useTimerStore((state) => state.mode)
  const theme = useSettingsStore((state) => state.theme)
  const lightDataMode = useSettingsStore((state) => state.lightDataMode)
  const resolvedTheme = useResolvedTheme(theme)
  const [settingsOpen, setSettingsOpen] = useState(false)

  useTimer()
  useDocumentTitle()
  useLanguage()

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = resolvedTheme
    root.dataset.mode = mode
    root.dataset.lightData = String(lightDataMode)

    const pageColor = getComputedStyle(root).getPropertyValue('--page').trim()
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', pageColor || '#c25542')
  }, [mode, resolvedTheme, lightDataMode])

  const openSettings = () => setSettingsOpen(true)
  const closeSettings = () => setSettingsOpen(false)

  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#main"
        className="sr-only rounded-md bg-control px-4 py-2 font-semibold text-on-control focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        {t('app.skipToContent')}
      </a>

      <Header onOpenSettings={openSettings} />

      <main id="main" className="w-full flex-1">
        <Outlet context={{ openSettings }} />
      </main>

      <SettingsModal open={settingsOpen} onClose={closeSettings} />
      <RewardModal />
    </div>
  )
}
