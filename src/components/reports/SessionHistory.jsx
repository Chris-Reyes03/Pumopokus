import { useTranslation } from 'react-i18next'
import { useTaskStore } from '../../store/taskStore'
import { getLocalDayKey, parseDayKey, shiftDayKey } from '../../utils/stats'
import { getSubjectLabel } from '../../utils/tasks'

export default function SessionHistory({ groups }) {
  const { t, i18n } = useTranslation()
  const tasks = useTaskStore((state) => state.tasks)
  const subjects = useTaskStore((state) => state.subjects)
  const locale = i18n.resolvedLanguage || i18n.language || 'en'
  const time = new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit' })
  const date = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  const todayKey = getLocalDayKey()
  const yesterdayKey = shiftDayKey(todayKey, -1)

  const dayLabel = (key) => {
    if (key === todayKey) return t('reports.history.today')
    if (key === yesterdayKey) return t('reports.history.yesterday')
    return date.format(parseDayKey(key))
  }

  return (
    <div className="mt-6 border-t border-paper-line pt-5">
      <h3 className="text-base font-semibold">{t('reports.history.title')}</h3>

      {groups.length === 0 ? (
        <p className="mt-3 text-sm text-on-paper-muted">{t('reports.history.empty')}</p>
      ) : (
        <div className="mt-3 space-y-4">
          {groups.map((group) => (
            <div key={group.key}>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-on-paper-muted">
                {dayLabel(group.key)}
              </h4>
              <ul className="mt-1 divide-y divide-paper-line">
                {group.sessions.map((session) => {
                  const task = tasks.find((item) => item.id === session.taskId)
                  const subject = subjects.find((item) => item.id === session.subjectId)
                  const subjectLabel = getSubjectLabel(subject, t)
                  const title = task ? task.name : subjectLabel || t('reports.history.focus')

                  return (
                    <li key={session.id} className="flex items-center gap-2 py-2">
                      <span className="w-14 shrink-0 text-xs tabular-nums text-on-paper-muted">
                        {time.format(new Date(session.endedAt))}
                      </span>
                      {subject ? (
                        <span
                          aria-hidden="true"
                          className="size-2 shrink-0 rounded-full"
                          style={{ backgroundColor: subject.color }}
                        />
                      ) : null}
                      <span className="min-w-0 flex-1 truncate text-sm">{title}</span>
                      {task && subjectLabel ? (
                        <span className="hidden shrink-0 text-xs text-on-paper-muted sm:inline">
                          {subjectLabel}
                        </span>
                      ) : null}
                      <span className="shrink-0 text-xs font-semibold tabular-nums">
                        {t('reports.history.minutes', { minutes: session.minutes })}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
