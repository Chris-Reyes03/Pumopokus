import { useEffect, useId, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useRewardStore } from '../store/rewardStore'
import { TomatoMark } from './icons'
import Button from './ui/Button'

export default function RewardModal() {
  const { t, i18n } = useTranslation()
  const quote = useRewardStore((state) => state.quote)
  const dismiss = useRewardStore((state) => state.dismiss)
  const dialogRef = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (quote) {
      if (typeof dialog.showModal === 'function') {
        if (!dialog.open) dialog.showModal()
      } else {
        dialog.setAttribute('open', '')
      }
      return
    }

    if (!dialog.open) return
    if (typeof dialog.close === 'function') {
      dialog.close()
    } else {
      dialog.removeAttribute('open')
      dialog.dispatchEvent(new Event('close'))
    }
  }, [quote])

  useEffect(() => {
    if (!quote) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [quote])

  const handleBackdropPointerDown = (event) => {
    if (event.target === event.currentTarget) dismiss()
  }

  const handleCancel = (event) => {
    event.preventDefault()
    dismiss()
  }

  const language = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('fil') ? 'fil' : 'en'
  const primary = language === 'fil' ? quote?.fil : quote?.en
  const secondary = language === 'fil' ? quote?.en : quote?.fil
  const primaryLabel = t(language === 'fil' ? 'language.filipino' : 'language.english')
  const secondaryLabel = t(language === 'fil' ? 'language.english' : 'language.filipino')

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={dismiss}
      onCancel={handleCancel}
      onPointerDown={handleBackdropPointerDown}
      className="m-auto w-[calc(100%-2rem)] max-w-md overflow-hidden rounded-card bg-paper text-on-paper shadow-card"
    >
      <div className="paper-scope p-6 text-center sm:p-8">
        <TomatoMark className="mx-auto size-10 text-tomato" />
        <h2 id={titleId} className="mt-3 font-display text-2xl font-bold tracking-tight">
          {t('reward.title')}
        </h2>
        <p className="mt-1 text-sm text-on-paper-muted">{t('reward.subtitle')}</p>

        <blockquote className="mt-5 rounded-2xl bg-tomato-soft px-4 py-5 text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-tomato">
            {primaryLabel}
          </p>
          <p className="mt-1 font-display text-lg font-semibold leading-snug">{primary}</p>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-on-paper-muted">
            {secondaryLabel}
          </p>
          <p className="mt-1 text-sm leading-6 text-on-paper-muted">{secondary}</p>
          {quote?.region ? (
            <p className="mt-3 text-[11px] uppercase tracking-wide text-on-paper-muted">
              {quote.region}
            </p>
          ) : null}
        </blockquote>

        <Button variant="accent" size="md" onClick={dismiss} className="mt-5 w-full">
          {t('reward.close')}
        </Button>
      </div>
    </dialog>
  )
}
