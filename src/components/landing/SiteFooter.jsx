import { useTranslation } from 'react-i18next'
import { TomatoMark } from '../icons'

const linkClassName =
  'rounded-md text-sm font-medium text-on-paper-muted transition-colors hover:text-on-paper'

export default function SiteFooter({ onOpenSettings }) {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0 })
  }

  return (
    <footer className="mt-4 border-t border-paper-line">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-2.5">
            <TomatoMark className="mt-0.5 size-7 shrink-0 text-tomato" />
            <div>
              <p className="font-display text-lg font-bold lowercase tracking-tight">
                {t('app.wordmark')}
              </p>
              <p className="mt-0.5 text-xs text-on-paper-muted">{t('landing.footer.tagline')}</p>
            </div>
          </div>

          <nav
            aria-label={t('landing.footer.navLabel')}
            className="flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            <a href="#timer" className={linkClassName}>
              {t('landing.footer.links.timer')}
            </a>
            <a href="#guide" className={linkClassName}>
              {t('landing.footer.links.guide')}
            </a>
            <a href="#features" className={linkClassName}>
              {t('landing.footer.links.features')}
            </a>
            <button type="button" onClick={onOpenSettings} className={linkClassName}>
              {t('landing.footer.links.settings')}
            </button>
            <button type="button" onClick={scrollToTop} className={linkClassName}>
              {t('landing.footer.links.top')}
            </button>
          </nav>
        </div>

        <div className="mt-6 flex flex-col gap-1 border-t border-paper-line pt-5 text-xs text-on-paper-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{t('landing.footer.copyright', { year })}</p>
          <p>{t('landing.footer.credit')}</p>
        </div>
      </div>
    </footer>
  )
}
