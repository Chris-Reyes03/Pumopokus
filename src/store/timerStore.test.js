import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MODES } from '../constants/modes'
import { useSettingsStore } from './settingsStore'
import { createInitialTimerState, useTimerStore } from './timerStore'

const DURATIONS = { pomodoro: 1, shortBreak: 1, longBreak: 2 }

function resetStores(overrides = {}) {
  useSettingsStore.setState({
    durations: DURATIONS,
    longBreakInterval: 4,
    autoStart: { breaks: false, pomodoros: false },
    language: 'en',
    theme: 'system',
    lightDataMode: false,
    soundVolumes: { chime: 0 },
    ambientVolumes: { rain: 0, ocean: 0, brown: 0 },
    notificationsEnabled: false,
    ...overrides,
  })
  useTimerStore.setState(createInitialTimerState())
}

describe('timerStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-11-23T08:00:00.000Z'))
    resetStores()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts from the configured duration using an end timestamp', () => {
    const startedAt = Date.now()
    useTimerStore.getState().start()

    const state = useTimerStore.getState()
    expect(state.status).toBe('running')
    expect(state.endAt).toBe(startedAt + 60_000)
    expect(state.remainingMs).toBe(60_000)
    expect(state.startedAt).toBe(startedAt)
  })

  it('pauses by folding the remaining time and resumes from it', () => {
    useTimerStore.getState().start()
    vi.setSystemTime(Date.now() + 20_000)

    useTimerStore.getState().pause()
    let state = useTimerStore.getState()
    expect(state.status).toBe('paused')
    expect(state.endAt).toBeNull()
    expect(state.remainingMs).toBe(40_000)

    const resumedAt = Date.now()
    useTimerStore.getState().start()
    state = useTimerStore.getState()
    expect(state.status).toBe('running')
    expect(state.endAt).toBe(resumedAt + 40_000)
  })

  it('only updates the remaining time when the displayed second changes', () => {
    useTimerStore.getState().start()
    useTimerStore.getState().setRemaining(58_500)
    expect(useTimerStore.getState().remainingMs).toBe(58_500)

    useTimerStore.getState().setRemaining(58_400)
    expect(useTimerStore.getState().remainingMs).toBe(58_500)

    useTimerStore.getState().setRemaining(58_000)
    expect(useTimerStore.getState().remainingMs).toBe(58_000)
  })

  it('moves focus rounds into short breaks without auto-starting by default', () => {
    useTimerStore.getState().start()
    const result = useTimerStore.getState().finishRound()

    const state = useTimerStore.getState()
    expect(result).toEqual({ completedMode: MODES.pomodoro, nextMode: MODES.shortBreak })
    expect(state.mode).toBe(MODES.shortBreak)
    expect(state.status).toBe('idle')
    expect(state.endAt).toBeNull()
    expect(state.pomodorosInCycle).toBe(1)
    expect(state.remainingMs).toBe(60_000)
  })

  it('awards a long break after the fourth focus round', () => {
    useTimerStore.setState({
      ...useTimerStore.getState(),
      mode: MODES.pomodoro,
      status: 'running',
      endAt: Date.now() + 1_000,
      pomodorosInCycle: 3,
    })

    useTimerStore.getState().finishRound()

    const state = useTimerStore.getState()
    expect(state.mode).toBe(MODES.longBreak)
    expect(state.pomodorosInCycle).toBe(4)
    expect(state.remainingMs).toBe(120_000)
  })

  it('uses the configured long-break interval', () => {
    resetStores({ longBreakInterval: 2 })
    useTimerStore.setState({
      ...useTimerStore.getState(),
      mode: MODES.pomodoro,
      status: 'running',
      endAt: Date.now() + 1_000,
      pomodorosInCycle: 1,
    })

    useTimerStore.getState().finishRound()

    const state = useTimerStore.getState()
    expect(state.mode).toBe(MODES.longBreak)
    expect(state.pomodorosInCycle).toBe(2)
  })

  it('returns to focus and resets the cycle after a long break', () => {
    useTimerStore.setState({
      ...useTimerStore.getState(),
      mode: MODES.longBreak,
      status: 'running',
      endAt: Date.now() + 1_000,
      durationMs: 120_000,
      remainingMs: 1_000,
      pomodorosInCycle: 4,
    })

    useTimerStore.getState().finishRound()

    const state = useTimerStore.getState()
    expect(state.mode).toBe(MODES.pomodoro)
    expect(state.pomodorosInCycle).toBe(0)
    expect(state.status).toBe('idle')
  })

  it('auto-starts breaks when the setting is enabled', () => {
    resetStores({ autoStart: { breaks: true, pomodoros: false } })
    useTimerStore.getState().start()

    useTimerStore.getState().finishRound()

    const state = useTimerStore.getState()
    expect(state.mode).toBe(MODES.shortBreak)
    expect(state.status).toBe('running')
    expect(state.endAt).toBe(Date.now() + 60_000)
  })

  it('auto-starts focus after a break when enabled', () => {
    resetStores({ autoStart: { breaks: false, pomodoros: true } })
    useTimerStore.setState({
      ...useTimerStore.getState(),
      mode: MODES.shortBreak,
      status: 'running',
      endAt: Date.now() + 1_000,
    })

    useTimerStore.getState().finishRound()

    const state = useTimerStore.getState()
    expect(state.mode).toBe(MODES.pomodoro)
    expect(state.status).toBe('running')
  })

  it('ignores finishRound when the timer is not running', () => {
    expect(useTimerStore.getState().finishRound()).toBeNull()
  })

  it('skips without counting the focus round or auto-starting', () => {
    useSettingsStore.setState({ autoStart: { breaks: true, pomodoros: true } })
    useTimerStore.getState().start()

    useTimerStore.getState().skip()

    const state = useTimerStore.getState()
    expect(state.mode).toBe(MODES.shortBreak)
    expect(state.status).toBe('idle')
    expect(state.pomodorosInCycle).toBe(0)
  })

  it('uses the configured interval when skipping', () => {
    resetStores({ longBreakInterval: 2 })
    useTimerStore.setState({
      ...useTimerStore.getState(),
      mode: MODES.pomodoro,
      pomodorosInCycle: 2,
    })

    useTimerStore.getState().skip()

    expect(useTimerStore.getState().mode).toBe(MODES.longBreak)
    expect(useTimerStore.getState().pomodorosInCycle).toBe(2)
  })

  it('resets the current round but keeps the cycle count', () => {
    useTimerStore.setState({
      ...useTimerStore.getState(),
      mode: MODES.shortBreak,
      status: 'running',
      endAt: Date.now() + 5_000,
      remainingMs: 5_000,
      pomodorosInCycle: 2,
    })

    useTimerStore.getState().reset()

    const state = useTimerStore.getState()
    expect(state.status).toBe('idle')
    expect(state.mode).toBe(MODES.shortBreak)
    expect(state.remainingMs).toBe(60_000)
    expect(state.pomodorosInCycle).toBe(2)
    expect(state.endAt).toBeNull()
  })

  it('switches modes with the configured duration and rejects invalid modes', () => {
    useTimerStore.getState().setMode(MODES.longBreak)
    expect(useTimerStore.getState().remainingMs).toBe(120_000)

    useTimerStore.getState().setMode('nap')
    expect(useTimerStore.getState().mode).toBe(MODES.longBreak)
  })

  it('applies new durations immediately only while idle', () => {
    useTimerStore.getState().syncDurations({ ...DURATIONS, pomodoro: 30 })
    expect(useTimerStore.getState().remainingMs).toBe(30 * 60_000)

    useTimerStore.getState().start()
    useTimerStore.getState().syncDurations({ ...DURATIONS, pomodoro: 50 })
    expect(useTimerStore.getState().remainingMs).toBe(30 * 60_000)
  })
})
