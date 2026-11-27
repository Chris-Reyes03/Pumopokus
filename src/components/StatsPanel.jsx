import { useTranslation } from 'react-i18next'
import { useFocusStats } from '../hooks/useFocusStats'
import Heatmap from './Heatmap'

function StatTile({ label, value }) {
  return (
    <div className="min-w-0 rounded-2xl border border-paper-line bg-paper px-3 py-2.5">
      <p className="break-words text-[11px] font-semibold uppercase tracking-[0.1em] text-on-paper-muted">
        {label}
      </p>
      <p className="mt-1 font-display text-lg font-bold tabular-nums">{value}</p>
    </div>
  )
}

export default function StatsPanel() {
  const { t } = useTranslation()
  const stats = useFocusStats()

  return (
    <section
      id="stats"
      className="mx-auto w-full max-w-3xl scroll-mt-6 px-4 pt-12 sm:px-6 sm:pt-16"
    >
      <div className="rounded-card border border-paper-line bg-paper-raised p-4 shadow-card sm:p-6">
        <h2 className="font-display text-2xl font-bold tracking-tight">{t('stats.title')}</h2>
        <p className="mt-1 text-sm text-on-paper-muted">{t('stats.subtitle')}</p>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <StatTile
            label={t('stats.today')}
            value={t('stats.minutes', { minutes: stats.todayMinutes })}
          />
          <StatTile
            label={t('stats.currentStreak')}
            value={t('stats.days', { count: stats.current })}
          />
          <StatTile
            label={t('stats.longestStreak')}
            value={t('stats.days', { count: stats.longest })}
          />
        </div>

        <div className="mt-5">
          <Heatmap data={stats} />
        </div>
      </div>
    </section>
  )
}
