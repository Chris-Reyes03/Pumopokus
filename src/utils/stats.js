export const HEATMAP_WEEKS = 26

function pad(value) {
  return String(value).padStart(2, '0')
}

export function getLocalDayKey(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function parseDayKey(key) {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function shiftDayKey(key, delta) {
  const date = parseDayKey(key)
  date.setDate(date.getDate() + delta)
  return getLocalDayKey(date)
}

export function aggregateDaily(sessions) {
  const daily = new Map()

  for (const session of Array.isArray(sessions) ? sessions : []) {
    if (!session || session.mode !== 'pomodoro') continue
    const key = getLocalDayKey(session.endedAt)
    if (!key) continue

    const entry = daily.get(key) ?? { minutes: 0, pomodoros: 0 }
    entry.minutes += Number.isFinite(session.minutes) ? Math.max(0, session.minutes) : 0
    entry.pomodoros += 1
    daily.set(key, entry)
  }

  return daily
}

export function getLevelForMinutes(minutes) {
  if (!Number.isFinite(minutes) || minutes <= 0) return 0
  if (minutes < 15) return 1
  if (minutes < 30) return 2
  if (minutes < 60) return 3
  return 4
}

export function computeStreaks(sessions, now = new Date()) {
  const daily = aggregateDaily(sessions)
  const activeKeys = [...daily.entries()]
    .filter(([, day]) => day.pomodoros > 0)
    .map(([key]) => key)
    .sort()

  let longest = 0
  let run = 0
  let previous = null

  for (const key of activeKeys) {
    run = previous && shiftDayKey(previous, 1) === key ? run + 1 : 1
    if (run > longest) longest = run
    previous = key
  }

  const todayKey = getLocalDayKey(now)
  let cursor = daily.get(todayKey)?.pomodoros ? todayKey : shiftDayKey(todayKey, -1)
  let current = 0

  while (daily.get(cursor)?.pomodoros) {
    current += 1
    cursor = shiftDayKey(cursor, -1)
  }

  return {
    current,
    longest,
    activeDays: activeKeys.length,
    todayKey,
    todayMinutes: daily.get(todayKey)?.minutes ?? 0,
  }
}

export function buildHeatmap(sessions, { weeks = HEATMAP_WEEKS, now = new Date() } = {}) {
  const daily = aggregateDaily(sessions)
  const todayKey = getLocalDayKey(now)
  const today = parseDayKey(todayKey)

  const mondayIndex = (today.getDay() + 6) % 7
  const thisMonday = new Date(today)
  thisMonday.setDate(today.getDate() - mondayIndex)

  const firstMonday = new Date(thisMonday)
  firstMonday.setDate(thisMonday.getDate() - (weeks - 1) * 7)

  const weekList = []
  let totalMinutes = 0
  let totalPomodoros = 0
  let activeDays = 0

  for (let weekIndex = 0; weekIndex < weeks; weekIndex += 1) {
    const days = []

    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const date = new Date(firstMonday)
      date.setDate(firstMonday.getDate() + weekIndex * 7 + dayIndex)
      const key = getLocalDayKey(date)
      const entry = daily.get(key)
      const future = key > todayKey
      const minutes = entry?.minutes ?? 0
      const pomodoros = entry?.pomodoros ?? 0

      if (!future) {
        totalMinutes += minutes
        totalPomodoros += pomodoros
        if (pomodoros > 0) activeDays += 1
      }

      days.push({
        key,
        minutes,
        pomodoros,
        future,
        level: future ? -1 : getLevelForMinutes(minutes),
      })
    }

    weekList.push({ days })
  }

  return { weeks: weekList, todayKey, totalMinutes, totalPomodoros, activeDays }
}
