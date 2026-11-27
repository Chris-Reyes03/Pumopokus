import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import LanguageToggle from './LanguageToggle'
import ThemeToggle from './ThemeToggle'
import { SlidersIcon, TomatoMark } from './icons'

export default function Header({ onOpenSettings }) {
  const { t } = useTranslation()

  return (
    <header className="mx-auto w-full max-w-3xl px-4 sm:px-6">
      <div className="flex h-16 items-center justify-between gap-3 border-b border-white/35">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-lg text-on-page transition-opacity hover:opacity-90"
        >
          <TomatoMark className="size-7" />
          <span className="font-display text-lg font-bold lowercase tracking-tight sm:text-2xl">
            {t('app.wordmark')}
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label={t('nav.settings')}
            title={t('nav.settings')}
            aria-haspopup="dialog"
            className="flex h-9 items-center gap-1.5 rounded-full bg-black/15 px-2.5 text-on-page transition-colors duration-150 hover:bg-black/25"
          >
            <SlidersIcon className="size-4" />
            <span className="hidden text-xs font-semibold sm:inline">{t('nav.settings')}</span>
          </button>
        </nav>
      </div>
    </header>
  )
}
