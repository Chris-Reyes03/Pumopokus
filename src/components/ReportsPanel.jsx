import { useTranslation } from 'react-i18next'
import { useReports } from '../hooks/useReports'
import ExamCountdown from './reports/ExamCountdown'
import SessionHistory from './reports/SessionHistory'
import SubjectBreakdown from './reports/SubjectBreakdown'
import WeeklyChart from './reports/WeeklyChart'

export default function ReportsPanel() {
  const { t } = useTranslation()
  const reports = useReports()

  return (
    <section
      id="reports"
      className="mx-auto w-full max-w-3xl scroll-mt-6 px-4 pt-12 sm:px-6 sm:pt-16"
    >
      <div className="rounded-card border border-paper-line bg-paper-raised p-4 shadow-card sm:p-6">
        <h2 className="font-display text-2xl font-bold tracking-tight">{t('reports.title')}</h2>
        <p className="mt-1 text-sm text-on-paper-muted">{t('reports.subtitle')}</p>

        <ExamCountdown />
        <WeeklyChart report={reports.weekly} />
        <SubjectBreakdown rows={reports.subjects} />
        <SessionHistory groups={reports.history} />
      </div>
    </section>
  )
}
