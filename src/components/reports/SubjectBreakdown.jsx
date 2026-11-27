import { useTranslation } from 'react-i18next'
import { useTaskStore } from '../../store/taskStore'
import { getSubjectLabel } from '../../utils/tasks'

export default function SubjectBreakdown({ rows }) {
  const { t } = useTranslation()
  const subjects = useTaskStore((state) => state.subjects)

  const resolve = (subjectId) => {
    const subject = subjects.find((item) => item.id === subjectId)
    if (subject) return { label: getSubjectLabel(subject, t), color: subject.color }
    if (!subjectId) return { label: t('reports.bySubject.none'), color: null }
    return { label: t('reports.bySubject.unknown'), color: null }
  }

  const maxMinutes = Math.max(1, ...rows.map((row) => row.minutes))

  return (
    <div className="mt-6 border-t border-paper-line pt-5">
      <h3 className="text-base font-semibold">{t('reports.bySubject.title')}</h3>

      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-on-paper-muted">{t('reports.bySubject.empty')}</p>
      ) : (
        <div className="mt-3 space-y-2.5">
          {rows.map((row) => {
            const { label, color } = resolve(row.subjectId)
            const width = Math.max(4, Math.round((row.minutes / maxMinutes) * 100))
            return (
              <div key={row.subjectId ?? 'none'} className="flex items-center gap-2">
                <span className="w-28 shrink-0 truncate text-xs font-medium sm:w-32">{label}</span>
                <div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-on-paper/10">
                  <div
                    className={`h-full rounded-full ${color ? '' : 'bg-on-paper-muted'}`}
                    style={{
                      width: `${width}%`,
                      ...(color ? { backgroundColor: color } : null),
                    }}
                  />
                </div>
                <span className="w-12 shrink-0 text-right text-xs tabular-nums text-on-paper-muted">
                  {t('reports.bySubject.minutes', { minutes: row.minutes })}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
