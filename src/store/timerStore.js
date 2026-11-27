import { create } from 'zustand'
import { MODES, MODE_LIST } from '../constants/modes'
import { getDurationMs, getNextMode, getSkipTransition } from '../utils/timer'
import { useSettingsStore } from './settingsStore'

export function createInitialTimerState() {
  const durationMs = getDurationMs(useSettingsStore.getState().durations, MODES.pomodoro)
  return {
    mode: MODES.pomodoro,
    status: 'idle',
    endAt: null,
    startedAt: null,
    durationMs,
    remainingMs: durationMs,
    pomodorosInCycle: 0,
  }
}

export const useTimerStore = create((set, get) => ({
  ...createInitialTimerState(),

  start: () => {
    const state = get()
    if (state.status === 'running') return
    const remainingMs = state.status === 'paused' ? state.remainingMs : state.durationMs
    if (remainingMs <= 0) return
    const now = Date.now()
    set({
      status: 'running',
      endAt: now + remainingMs,
      remainingMs,
      startedAt: state.startedAt ?? now,
    })
  },

  pause: () => {
    const state = get()
    if (state.status !== 'running' || !state.endAt) return
    set({
      status: 'paused',
      remainingMs: Math.max(0, state.endAt - Date.now()),
      endAt: null,
    })
  },

  toggle: () => {
    if (get().status === 'running') {
      get().pause()
    } else {
      get().start()
    }
  },

  reset: () => {
    const state = get()
    const durationMs = getDurationMs(useSettingsStore.getState().durations, state.mode)
    set({
      status: 'idle',
      durationMs,
      remainingMs: durationMs,
      endAt: null,
      startedAt: null,
    })
  },

  skip: () => {
    const state = get()
    const { longBreakInterval } = useSettingsStore.getState()
    const transition = getSkipTransition(state.mode, state.pomodorosInCycle, longBreakInterval)
    const durationMs = getDurationMs(useSettingsStore.getState().durations, transition.mode)
    set({
      mode: transition.mode,
      pomodorosInCycle: transition.pomodorosInCycle,
      status: 'idle',
      durationMs,
      remainingMs: durationMs,
      endAt: null,
      startedAt: null,
    })
  },

  setMode: (mode) => {
    if (!MODE_LIST.includes(mode)) return
    const durationMs = getDurationMs(useSettingsStore.getState().durations, mode)
    set({
      mode,
      status: 'idle',
      durationMs,
      remainingMs: durationMs,
      endAt: null,
      startedAt: null,
    })
  },

  setRemaining: (remainingMs) => {
    const state = get()
    if (state.status !== 'running') return
    if (Math.ceil(remainingMs / 1000) === Math.ceil(state.remainingMs / 1000)) return
    set({ remainingMs })
  },

  syncDurations: (durations) => {
    const state = get()
    if (state.status !== 'idle') return
    const durationMs = getDurationMs(durations, state.mode)
    set({ durationMs, remainingMs: durationMs })
  },

  finishRound: () => {
    const state = get()
    if (state.status !== 'running') return null

    const { autoStart, durations, longBreakInterval } = useSettingsStore.getState()
    const transition = getNextMode(state.mode, state.pomodorosInCycle, longBreakInterval)
    const wasFocus = state.mode === MODES.pomodoro
    const shouldAutoStart = wasFocus ? autoStart.breaks : autoStart.pomodoros
    const durationMs = getDurationMs(durations, transition.mode)
    const now = Date.now()

    set({
      mode: transition.mode,
      status: shouldAutoStart ? 'running' : 'idle',
      pomodorosInCycle: transition.pomodorosInCycle,
      durationMs,
      remainingMs: durationMs,
      endAt: shouldAutoStart ? now + durationMs : null,
      startedAt: shouldAutoStart ? now : null,
    })

    return { completedMode: state.mode, nextMode: transition.mode }
  },
}))
