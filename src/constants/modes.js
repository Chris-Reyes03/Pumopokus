export const MODES = {
  pomodoro: 'pomodoro',
  shortBreak: 'shortBreak',
  longBreak: 'longBreak',
}

export const MODE_LIST = [MODES.pomodoro, MODES.shortBreak, MODES.longBreak]

export const DEFAULT_DURATIONS = {
  [MODES.pomodoro]: 25,
  [MODES.shortBreak]: 5,
  [MODES.longBreak]: 15,
}

export const LONG_BREAK_INTERVAL = 4
export const MIN_LONG_BREAK_INTERVAL = 1
export const MAX_LONG_BREAK_INTERVAL = 12
export const MIN_DURATION_MINUTES = 1
export const MAX_DURATION_MINUTES = 90

export const isBreakMode = (mode) => mode === MODES.shortBreak || mode === MODES.longBreak
