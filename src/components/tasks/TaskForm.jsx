import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SUBJECT_COLORS } from '../../constants/subjects'
import { useTaskStore } from '../../store/taskStore'
import { MAX_ESTIMATE, MAX_SUBJECT_NAME, MAX_TASK_NAME, MIN_ESTIMATE } from '../../utils/tasks'
import Button from '../ui/Button'
import SubjectSelect from './SubjectSelect'

export default function TaskForm() {
  const { t } = useTranslation()
  const subjects = useTaskStore((state) => state.subjects)
  const addTask = useTaskStore((state) => state.addTask)
  const addSubject = useTaskStore((state) => state.addSubject)

  const [name, setName] = useState('')
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? '')
  const [estimate, setEstimate] = useState(1)
  const [subjectOpen, setSubjectOpen] = useState(false)
  const [subjectName, setSubjectName] = useState('')
  const [subjectColor, setSubjectColor] = useState(SUBJECT_COLORS[4])

  const handleSubmit = (event) => {
    event.preventDefault()
    const task = addTask({ name, subjectId, estimate: Number(estimate) })
    if (!task) return
    setName('')
    setEstimate(1)
  }

  const handleAddSubject = () => {
    const subject = addSubject({ name: subjectName, color: subjectColor })
    if (!subject) return
    setSubjectId(subject.id)
    setSubjectName('')
    setSubjectOpen(false)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <label htmlFor="task-name" className="sr-only">
        {t('tasks.nameLabel')}
      </label>
      <input
        id="task-name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        maxLength={MAX_TASK_NAME}
        placeholder={t('tasks.namePlaceholder')}
        autoComplete="off"
        className="h-11 w-full rounded-control border border-paper-line bg-paper-raised px-3 text-sm text-on-paper placeholder:text-on-paper-muted"
      />

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <SubjectSelect
          value={subjectId}
          onChange={setSubjectId}
          subjects={subjects}
          label={t('tasks.subject')}
          className="min-w-32 flex-1"
        />

        <label className="flex items-center gap-1.5 text-xs font-medium text-on-paper-muted">
          {t('tasks.estimate')}
          <input
            type="number"
            min={MIN_ESTIMATE}
            max={MAX_ESTIMATE}
            value={estimate}
            onChange={(event) => setEstimate(event.target.value)}
            className="h-11 w-16 rounded-control border border-paper-line bg-paper-raised px-2 text-center text-sm text-on-paper"
          />
        </label>

        <Button
          type="submit"
          variant="accent"
          size="md"
          disabled={!name.trim()}
          className="flex-1 sm:flex-none"
        >
          {t('tasks.addAction')}
        </Button>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setSubjectOpen((open) => !open)}
          aria-expanded={subjectOpen}
          className="rounded-md text-xs font-semibold text-tomato transition-colors hover:opacity-80"
        >
          {subjectOpen ? t('tasks.cancel') : t('tasks.newSubject')}
        </button>
      </div>

      {subjectOpen ? (
        <div className="mt-2 rounded-control border border-paper-line bg-paper p-3">
          <label htmlFor="subject-name" className="text-xs font-semibold">
            {t('tasks.subjectName')}
          </label>
          <input
            id="subject-name"
            value={subjectName}
            onChange={(event) => setSubjectName(event.target.value)}
            maxLength={MAX_SUBJECT_NAME}
            placeholder={t('tasks.subjectNamePlaceholder')}
            autoComplete="off"
            className="mt-1 h-10 w-full rounded-control border border-paper-line bg-paper-raised px-3 text-sm text-on-paper placeholder:text-on-paper-muted"
          />

          <div
            role="group"
            aria-label={t('tasks.subjectColor')}
            className="mt-3 flex flex-wrap gap-2"
          >
            {SUBJECT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={color}
                aria-pressed={subjectColor === color}
                onClick={() => setSubjectColor(color)}
                style={{ backgroundColor: color }}
                className={`size-7 rounded-full ring-offset-2 ring-offset-paper transition ${
                  subjectColor === color ? 'ring-2 ring-on-paper' : 'ring-1 ring-black/10'
                }`}
              />
            ))}
          </div>

          <div className="mt-3 flex justify-end">
            <Button
              type="button"
              variant="paperOutline"
              size="sm"
              onClick={handleAddSubject}
              disabled={!subjectName.trim()}
            >
              {t('tasks.addSubject')}
            </Button>
          </div>
        </div>
      ) : null}
    </form>
  )
}
