import { DEFAULT_DURATIONS, LONG_BREAK_INTERVAL, MODES } from '../constants/modes'

export function minutesToMs(minutes) {
  return Math.round(minutes * 60 * 1000)
}

export function formatTime(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function getRemainingFraction(remainingMs, durationMs) {
  if (!Number.isFinite(durationMs) || durationMs <= 0) return 0
  return Math.min(1, Math.max(0, remainingMs / durationMs))
}

export function getNextMode(mode, pomodorosInCycle, interval = LONG_BREAK_INTERVAL) {
  if (mode === MODES.pomodoro) {
    const completed = pomodorosInCycle + 1
    return {
      mode: completed >= interval ? MODES.longBreak : MODES.shortBreak,
      pomodorosInCycle: Math.min(completed, interval),
    }
  }
  if (mode === MODES.longBreak) {
    return { mode: MODES.pomodoro, pomodorosInCycle: 0 }
  }
  return { mode: MODES.pomodoro, pomodorosInCycle }
}

export function getSkipTransition(mode, pomodorosInCycle, interval = LONG_BREAK_INTERVAL) {
  if (mode === MODES.pomodoro) {
    const next = pomodorosInCycle >= interval ? MODES.longBreak : MODES.shortBreak
    return { mode: next, pomodorosInCycle }
  }
  if (mode === MODES.longBreak) {
    return { mode: MODES.pomodoro, pomodorosInCycle: 0 }
  }
  return { mode: MODES.pomodoro, pomodorosInCycle }
}

export function resolveTheme(theme, prefersDark) {
  if (theme === 'system') return prefersDark ? 'dark' : 'light'
  return theme
}

export function getDurationMs(durations, mode) {
  const minutes = durations?.[mode]
  return minutesToMs(Number.isFinite(minutes) ? minutes : DEFAULT_DURATIONS[mode])
}
