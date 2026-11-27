import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { parseDayKey } from '../utils/stats'

const LEVEL_CLASSES = [
  'bg-on-paper/10',
  'bg-tomato/25',
  'bg-tomato/45',
  'bg-tomato/70',
  'bg-tomato',
]

export default function Heatmap({ data }) {
  const { t, i18n } = useTranslation()
  const scrollRef = useRef(null)
  const locale = i18n.resolvedLanguage || i18n.language || 'en'

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  const monthFormatter = new Intl.DateTimeFormat(locale, { month: 'short' })
  const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: 'short' })

  const firstWeek = data.weeks[0]
  const weekdayLabels = firstWeek.days.map((day, index) =>
    index % 2 === 0 && index < 6 ? weekdayFormatter.format(parseDayKey(day.key)) : '',
  )

  useEffect(() => {
    const element = scrollRef.current
    if (element) element.scrollLeft = element.scrollWidth
  }, [data.weeks])

  return (
    <div>
      <p className="sr-only">
        {t('stats.summary', {
          minutes: data.totalMinutes,
          days: data.activeDaysInRange,
        })}
      </p>

      <div className="flex gap-[3px]" aria-hidden="true">
        <div className="flex w-6 shrink-0 flex-col gap-[3px] pr-1.5 pt-[14px] text-[9px] leading-[10px] text-on-paper-muted">
          {weekdayLabels.map((label, index) => (
            <span key={firstWeek.days[index].key} className="h-2.5">
              {label}
            </span>
          ))}
        </div>

        <div
          ref={scrollRef}
          className="min-w-0 flex-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="inline-flex flex-col gap-1">
            <div className="flex gap-[3px]">
              {data.weeks.map((week, index) => {
                const month = parseDayKey(week.days[0].key).getMonth()
                const previousMonth =
                  index > 0 ? parseDayKey(data.weeks[index - 1].days[0].key).getMonth() : null

                return (
                  <span
                    key={week.days[0].key}
                    className="w-2.5 shrink-0 whitespace-nowrap text-[10px] leading-none text-on-paper-muted"
                  >
                    {month !== previousMonth
                      ? monthFormatter.format(parseDayKey(week.days[0].key))
                      : ''}
                  </span>
                )
              })}
            </div>

            <div className="flex gap-[3px]">
              {data.weeks.map((week) => (
                <div key={week.days[0].key} className="flex shrink-0 flex-col gap-[3px]">
                  {week.days.map((cell) => (
                    <span
                      key={cell.key}
                      title={
                        cell.future
                          ? undefined
                          : t('stats.tooltip', {
                              date: dateFormatter.format(parseDayKey(cell.key)),
                              minutes: cell.minutes,
                            })
                      }
                      className={`size-2.5 rounded-[2px] transition-colors ${
                        cell.future ? 'bg-transparent' : LEVEL_CLASSES[cell.level]
                      }`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-on-paper-muted">
        <span>{t('stats.less')}</span>
        {LEVEL_CLASSES.map((className) => (
          <span key={className} className={`size-2.5 rounded-[2px] ${className}`} />
        ))}
        <span>{t('stats.more')}</span>
      </div>
    </div>
  )
}
