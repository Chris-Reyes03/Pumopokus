import { useTranslation } from 'react-i18next'
import { useExamStore } from '../../store/examStore'
import { computeExamCountdown } from '../../utils/reports'
import { parseDayKey } from '../../utils/stats'

export default function ExamCountdown() {
  const { t, i18n } = useTranslation()
  const date = useExamStore((state) => state.date)
  const setDate = useExamStore((state) => state.setDate)
  const countdown = computeExamCountdown(date)
  const locale = i18n.resolvedLanguage || i18n.language || 'en'
  const formatted = date
    ? new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(parseDayKey(date))
    : null

  const message = {
    future: t('reports.exam.days', { count: countdown.days }),
    today: t('reports.exam.today'),
    past: t('reports.exam.past'),
    none: t('reports.exam.empty'),
  }[countdown.status]

  const accent =
    countdown.status === 'future' || countdown.status === 'today'
      ? 'text-tomato'
      : 'text-on-paper-muted'

  return (
    <div className="mt-6 rounded-2xl border border-paper-line bg-paper p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold">{t('reports.exam.title')}</h3>
          {formatted ? (
            <p className="mt-0.5 truncate text-xs text-on-paper-muted">{formatted}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="exam-date" className="sr-only">
            {t('reports.exam.label')}
          </label>
          <input
            id="exam-date"
            type="date"
            value={date ?? ''}
            onChange={(event) => setDate(event.target.value)}
            className="h-9 rounded-control border border-paper-line bg-paper-raised px-2 text-sm text-on-paper"
          />
          {date ? (
            <button
              type="button"
              onClick={() => setDate(null)}
              className="rounded-md px-1 text-xs font-semibold text-tomato transition-opacity hover:opacity-80"
            >
              {t('reports.exam.clear')}
            </button>
          ) : null}
        </div>
      </div>
      <p
        aria-live="polite"
        className={`mt-3 font-display text-2xl font-bold tracking-tight ${accent}`}
      >
        {message}
      </p>
    </div>
  )
}
