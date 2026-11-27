import { DEFAULT_SUBJECTS, SUBJECT_COLORS } from '../constants/subjects'

export const MIN_ESTIMATE = 1
export const MAX_ESTIMATE = 99
export const MAX_TASK_NAME = 120
export const MAX_SUBJECT_NAME = 40

const HEX_COLOR = /^#[0-9a-f]{6}$/i

export function clampEstimate(value, fallback = MIN_ESTIMATE) {
  const number = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(number)) return fallback
  return Math.min(MAX_ESTIMATE, Math.max(MIN_ESTIMATE, Math.round(number)))
}

function normalizeName(value, maxLength) {
  if (typeof value !== 'string') return ''
  return value.trim().replace(/\s+/g, ' ').slice(0, maxLength)
}

export function normalizeSubjects(raw) {
  const subjects = DEFAULT_SUBJECTS.map((subject) => ({ ...subject }))
  const seen = new Set(subjects.map((subject) => subject.id))
  if (!Array.isArray(raw)) return subjects

  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const id = typeof item.id === 'string' ? item.id.trim() : ''
    if (!id || seen.has(id)) continue
    const name = normalizeName(item.name, MAX_SUBJECT_NAME)
    if (!name) continue
    const color = HEX_COLOR.test(item.color)
      ? item.color
      : SUBJECT_COLORS[subjects.length % SUBJECT_COLORS.length]
    subjects.push({ id, name, color })
    seen.add(id)
  }

  return subjects
}

export function normalizeTasks(raw, subjectIds) {
  if (!Array.isArray(raw)) return []
  const validSubjects = new Set(subjectIds)
  const seen = new Set()
  const tasks = []

  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const id = typeof item.id === 'string' ? item.id.trim() : ''
    if (!id || seen.has(id)) continue
    const name = normalizeName(item.name, MAX_TASK_NAME)
    if (!name) continue

    tasks.push({
      id,
      name,
      subjectId: validSubjects.has(item.subjectId) ? item.subjectId : null,
      estimate: clampEstimate(item.estimate),
      completedPomodoros: Number.isFinite(item.completedPomodoros)
        ? Math.max(0, Math.floor(item.completedPomodoros))
        : 0,
      done: Boolean(item.done),
      createdAt:
        typeof item.createdAt === 'string' && !Number.isNaN(Date.parse(item.createdAt))
          ? item.createdAt
          : new Date().toISOString(),
    })
    seen.add(id)
  }

  return tasks
}

export function getDefaultTaskState() {
  return { subjects: normalizeSubjects([]), tasks: [], activeTaskId: null }
}

export function normalizeTaskState(raw) {
  if (!raw || typeof raw !== 'object') return getDefaultTaskState()

  const subjects = normalizeSubjects(raw.subjects)
  const tasks = normalizeTasks(
    raw.tasks,
    subjects.map((subject) => subject.id),
  )
  const activeTask = tasks.find((task) => task.id === raw.activeTaskId)
  const activeTaskId = activeTask && !activeTask.done ? activeTask.id : null

  return { subjects, tasks, activeTaskId }
}

export function pickTaskState(state) {
  return {
    subjects: state.subjects,
    tasks: state.tasks,
    activeTaskId: state.activeTaskId,
  }
}

export function getSubjectLabel(subject, t) {
  if (!subject) return ''
  return subject.nameKey ? t(subject.nameKey) : subject.name
}
