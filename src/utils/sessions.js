const ISO_LIKE = (value) => typeof value === 'string' && !Number.isNaN(Date.parse(value))

export function normalizeSessions(raw) {
  const list = Array.isArray(raw) ? raw : Array.isArray(raw?.sessions) ? raw.sessions : []
  const sessions = []

  for (const item of list) {
    if (!item || typeof item !== 'object') continue
    const id = typeof item.id === 'string' ? item.id.trim() : ''
    if (!id) continue
    if (!ISO_LIKE(item.startedAt) || !ISO_LIKE(item.endedAt)) continue
    if (!Number.isFinite(item.minutes) || item.minutes <= 0) continue

    sessions.push({
      id,
      startedAt: item.startedAt,
      endedAt: item.endedAt,
      minutes: Math.round(item.minutes),
      subjectId: typeof item.subjectId === 'string' ? item.subjectId : null,
      taskId: typeof item.taskId === 'string' ? item.taskId : null,
      mode: typeof item.mode === 'string' ? item.mode : 'pomodoro',
    })
  }

  return sessions
}

export function pickSessionState(state) {
  return { sessions: state.sessions }
}
