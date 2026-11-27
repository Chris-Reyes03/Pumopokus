import { aggregateDaily, getLocalDayKey, parseDayKey, shiftDayKey } from './stats'

const DAY_MS = 24 * 60 * 60 * 1000
const EXAM_DATE = /^\d{4}-\d{2}-\d{2}$/

function utcDayNumber(key) {
  const date = parseDayKey(key)
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS
}

export function normalizeExamDate(value) {
  if (typeof value !== 'string' || !EXAM_DATE.test(value)) return null
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null
  }
  return value
}

export function normalizeExam(raw) {
  return { date: normalizeExamDate(raw?.date) }
}

export function computeExamCountdown(date, now = new Date()) {
  const key = normalizeExamDate(date)
  if (!key) return { status: 'none', days: null }
  const days = Math.round(utcDayNumber(key) - utcDayNumber(getLocalDayKey(now)))
  if (days > 0) return { status: 'future', days }
  if (days === 0) return { status: 'today', days: 0 }
  return { status: 'past', days }
}

export function buildWeeklyReport(sessions, now = new Date()) {
  const daily = aggregateDaily(sessions)
  const todayKey = getLocalDayKey(now)
  const days = []
  let totalMinutes = 0
  let totalSessions = 0

  for (let offset = 6; offset >= 0; offset -= 1) {
    const key = shiftDayKey(todayKey, -offset)
    const entry = daily.get(key)
    const minutes = entry?.minutes ?? 0
    const count = entry?.pomodoros ?? 0
    totalMinutes += minutes
    totalSessions += count
    days.push({ key, minutes, sessions: count })
  }

  return {
    days,
    totalMinutes,
    totalSessions,
    maxMinutes: Math.max(1, ...days.map((day) => day.minutes)),
  }
}

export function buildSubjectReport(sessions, { days = 30, now = new Date() } = {}) {
  const todayKey = getLocalDayKey(now)
  const startKey = shiftDayKey(todayKey, -(days - 1))
  const totals = new Map()

  for (const session of Array.isArray(sessions) ? sessions : []) {
    if (!session || session.mode !== 'pomodoro') continue
    const key = getLocalDayKey(session.endedAt)
    if (!key || key < startKey || key > todayKey) continue

    const subjectId =
      typeof session.subjectId === 'string' && session.subjectId ? session.subjectId : null
    const entry = totals.get(subjectId) ?? { subjectId, minutes: 0, sessions: 0 }
    entry.minutes += Number.isFinite(session.minutes) ? Math.max(0, session.minutes) : 0
    entry.sessions += 1
    totals.set(subjectId, entry)
  }

  return [...totals.values()].sort((a, b) => b.minutes - a.minutes || b.sessions - a.sessions)
}

export function getRecentSessions(sessions, limit = 20) {
  return (Array.isArray(sessions) ? sessions : [])
    .filter(
      (session) =>
        session && session.mode === 'pomodoro' && !Number.isNaN(Date.parse(session.endedAt)),
    )
    .sort((a, b) => Date.parse(b.endedAt) - Date.parse(a.endedAt))
    .slice(0, limit)
}

export function groupSessionsByDay(sessions) {
  const groups = []

  for (const session of Array.isArray(sessions) ? sessions : []) {
    if (!session) continue
    const key = getLocalDayKey(session.endedAt)
    if (!key) continue
    const last = groups[groups.length - 1]
    if (last && last.key === key) last.sessions.push(session)
    else groups.push({ key, sessions: [session] })
  }

  return groups
}
