import { useTranslation } from 'react-i18next'
import { useTaskStore } from '../../store/taskStore'
import TaskForm from './TaskForm'
import TaskItem from './TaskItem'

export default function TaskList() {
  const { t } = useTranslation()
  const tasks = useTaskStore((state) => state.tasks)
  const subjects = useTaskStore((state) => state.subjects)
  const activeTaskId = useTaskStore((state) => state.activeTaskId)

  const activeTask = tasks.find((task) => task.id === activeTaskId) ?? null
  const activeSubject = subjects.find((subject) => subject.id === activeTask?.subjectId) ?? null

  return (
    <section
      id="tasks"
      className="mx-auto w-full max-w-3xl scroll-mt-6 px-4 pt-12 sm:px-6 sm:pt-16"
    >
      <div className="rounded-card border border-paper-line bg-paper-raised p-4 shadow-card sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight">{t('tasks.title')}</h2>
            <p className="mt-1 text-sm text-on-paper-muted">{t('tasks.subtitle')}</p>
          </div>
          {activeTask ? (
            <p className="flex max-w-full min-w-0 items-center gap-1.5 rounded-full bg-tomato-soft px-3 py-1 text-xs font-semibold text-tomato">
              {activeSubject ? (
                <span
                  aria-hidden="true"
                  style={{ backgroundColor: activeSubject.color }}
                  className="size-2 shrink-0 rounded-full"
                />
              ) : null}
              <span className="truncate">{t('tasks.focusingOn', { name: activeTask.name })}</span>
            </p>
          ) : null}
        </div>

        <TaskForm />

        {tasks.length ? (
          <ul className="mt-4 space-y-2">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </ul>
        ) : (
          <p className="mt-6 rounded-control border border-dashed border-paper-line px-4 py-6 text-center text-sm text-on-paper-muted">
            {t('tasks.empty')}
          </p>
        )}
      </div>
    </section>
  )
}
