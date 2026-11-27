import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTaskStore } from '../../store/taskStore'
import { MAX_ESTIMATE, MAX_TASK_NAME, MIN_ESTIMATE, getSubjectLabel } from '../../utils/tasks'
import { PencilIcon, TrashIcon } from '../icons'
import Button from '../ui/Button'
import SubjectSelect from './SubjectSelect'

const iconButton =
  'grid size-8 shrink-0 place-items-center rounded-md text-on-paper-muted transition-colors hover:bg-on-paper/10 hover:text-on-paper'

export default function TaskItem({ task }) {
  const { t } = useTranslation()
  const subjects = useTaskStore((state) => state.subjects)
  const activeTaskId = useTaskStore((state) => state.activeTaskId)
  const updateTask = useTaskStore((state) => state.updateTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const toggleDone = useTaskStore((state) => state.toggleDone)
  const setActiveTask = useTaskStore((state) => state.setActiveTask)

  const [editing, setEditing] = useState(false)
  const [draftName, setDraftName] = useState(task.name)
  const [draftSubject, setDraftSubject] = useState(task.subjectId)
  const [draftEstimate, setDraftEstimate] = useState(task.estimate)

  const subject = subjects.find((item) => item.id === task.subjectId) ?? null
  const active = activeTaskId === task.id
  const subjectLabel = getSubjectLabel(subject, t)

  const startEditing = () => {
    setDraftName(task.name)
    setDraftSubject(task.subjectId)
    setDraftEstimate(task.estimate)
    setEditing(true)
  }

  const saveEditing = (event) => {
    event.preventDefault()
    updateTask(task.id, {
      name: draftName,
      subjectId: draftSubject,
      estimate: Number(draftEstimate),
    })
    setEditing(false)
  }

  const handleDelete = () => {
    if (window.confirm(t('tasks.deleteConfirm'))) deleteTask(task.id)
  }

  return (
    <li
      className={`rounded-control border p-3 transition-colors ${
        active ? 'border-tomato bg-tomato-soft/50' : 'border-paper-line bg-paper'
      }`}
    >
      {editing ? (
        <form onSubmit={saveEditing} className="space-y-2">
          <input
            value={draftName}
            onChange={(event) => setDraftName(event.target.value)}
            maxLength={MAX_TASK_NAME}
            aria-label={t('tasks.nameLabel')}
            className="h-10 w-full rounded-control border border-paper-line bg-paper-raised px-3 text-sm text-on-paper"
          />
          <div className="flex flex-wrap items-center gap-2">
            <SubjectSelect
              value={draftSubject}
              onChange={setDraftSubject}
              subjects={subjects}
              label={t('tasks.subject')}
              className="h-10 min-w-28 flex-1"
            />
            <label className="flex items-center gap-1.5 text-xs font-medium text-on-paper-muted">
              {t('tasks.estimate')}
              <input
                type="number"
                min={MIN_ESTIMATE}
                max={MAX_ESTIMATE}
                value={draftEstimate}
                onChange={(event) => setDraftEstimate(event.target.value)}
                className="h-10 w-16 rounded-control border border-paper-line bg-paper-raised px-2 text-center text-sm text-on-paper"
              />
            </label>
            <div className="ml-auto flex gap-2">
              <Button
                type="button"
                variant="paperGhost"
                size="sm"
                onClick={() => setEditing(false)}
              >
                {t('tasks.cancel')}
              </Button>
              <Button type="submit" variant="accent" size="sm" disabled={!draftName.trim()}>
                {t('tasks.save')}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => toggleDone(task.id)}
            aria-label={t(task.done ? 'tasks.markNotDone' : 'tasks.markDone')}
            className="mt-1 size-4 shrink-0 accent-tomato"
          />

          <button
            type="button"
            onClick={() => setActiveTask(task.id)}
            aria-pressed={active}
            className="min-w-0 flex-1 rounded-md text-left"
          >
            <span className="flex items-center gap-2">
              {subject ? (
                <span
                  aria-hidden="true"
                  style={{ backgroundColor: subject.color }}
                  className="size-2.5 shrink-0 rounded-full"
                />
              ) : null}
              <span
                className={`truncate text-sm font-semibold ${
                  task.done ? 'line-through opacity-60' : ''
                }`}
              >
                {task.name}
              </span>
            </span>
            <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-on-paper-muted">
              {subject ? <span>{subjectLabel}</span> : null}
              <span
                aria-label={t('tasks.progress', {
                  done: task.completedPomodoros,
                  estimate: task.estimate,
                })}
                className="tabular-nums"
              >
                {task.completedPomodoros} / {task.estimate}
              </span>
              {active ? (
                <span className="font-semibold text-tomato">{t('tasks.active')}</span>
              ) : null}
            </span>
          </button>

          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              onClick={startEditing}
              aria-label={t('tasks.edit')}
              title={t('tasks.edit')}
              className={iconButton}
            >
              <PencilIcon />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              aria-label={t('tasks.delete')}
              title={t('tasks.delete')}
              className={iconButton}
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      )}
    </li>
  )
}
