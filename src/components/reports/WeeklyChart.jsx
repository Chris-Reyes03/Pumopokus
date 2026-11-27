import { useTranslation } from 'react-i18next'
import { parseDayKey } from '../../utils/stats'

export default function WeeklyChart({ report }) {
  const { t, i18n } = useTranslation()
  const locale = i18n.resolvedLanguage || i18n.language || 'en'
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'short' })
  const empty = report.totalSessions === 0

  return (
    <div className="mt-6 border-t border-paper-line pt-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="text-base font-semibold">{t('reports.week.title')}</h3>
        {empty ? null : (
          <p className="text-xs text-on-paper-muted">
            {t('reports.week.total', {
              count: report.totalSessions,
              minutes: report.totalMinutes,
            })}
          </p>
        )}
      </div>

      {empty ? (
        <p className="mt-3 text-sm text-on-paper-muted">{t('reports.week.empty')}</p>
      ) : (
        <div className="mt-4 flex items-end gap-1.5 sm:gap-2">
          {report.days.map((day) => {
            const label = weekday.format(parseDayKey(day.key))
            const height = day.minutes
              ? Math.max(6, Math.round((day.minutes / report.maxMinutes) * 100))
              : 0
            return (
              <div key={day.key} className="flex min-w-0 flex-1 flex-col items-center">
                <span className="sr-only">
                  {t('reports.week.barTitle', { day: label, minutes: day.minutes })}
                </span>
                <div className="flex h-24 w-full items-end">
                  <div
                    aria-hidden="true"
                    className={`w-full rounded-t-md ${
                      day.minutes ? 'bg-tomato' : 'bg-on-paper/10'
                    }`}
                    style={{ height: day.minutes ? `${height}%` : '4px' }}
                  />
                </div>
                <span
                  aria-hidden="true"
                  className="mt-1.5 text-[10px] font-medium text-on-paper-muted"
                >
                  {label}
                </span>
                <span aria-hidden="true" className="text-[10px] tabular-nums text-on-paper-muted">
                  {day.minutes || ''}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
