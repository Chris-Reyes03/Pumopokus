import { describe, expect, it } from 'vitest'
import { MODES } from '../constants/modes'
import {
  formatTime,
  getNextMode,
  getRemainingFraction,
  getSkipTransition,
  minutesToMs,
  resolveTheme,
} from './timer'

describe('formatTime', () => {
  it('formats whole minutes', () => {
    expect(formatTime(25 * 60 * 1000)).toBe('25:00')
    expect(formatTime(60 * 60 * 1000)).toBe('60:00')
  })

  it('rounds partial seconds up so the timer never shows 00:00 early', () => {
    expect(formatTime(61_000)).toBe('01:01')
    expect(formatTime(1_000)).toBe('00:01')
    expect(formatTime(999)).toBe('00:01')
  })

  it('clamps zero and negative values', () => {
    expect(formatTime(0)).toBe('00:00')
    expect(formatTime(-5_000)).toBe('00:00')
  })
})

describe('minutesToMs', () => {
  it('converts minutes to milliseconds', () => {
    expect(minutesToMs(5)).toBe(300_000)
    expect(minutesToMs(0.5)).toBe(30_000)
  })
})

describe('getNextMode', () => {
  it('goes from focus to a short break', () => {
    expect(getNextMode(MODES.pomodoro, 0)).toEqual({
      mode: MODES.shortBreak,
      pomodorosInCycle: 1,
    })
    expect(getNextMode(MODES.pomodoro, 2)).toEqual({
      mode: MODES.shortBreak,
      pomodorosInCycle: 3,
    })
  })

  it('awards a long break after the fourth focus round by default', () => {
    expect(getNextMode(MODES.pomodoro, 3)).toEqual({
      mode: MODES.longBreak,
      pomodorosInCycle: 4,
    })
  })

  it('uses a custom long-break interval', () => {
    expect(getNextMode(MODES.pomodoro, 0, 2)).toEqual({
      mode: MODES.shortBreak,
      pomodorosInCycle: 1,
    })
    expect(getNextMode(MODES.pomodoro, 1, 2)).toEqual({
      mode: MODES.longBreak,
      pomodorosInCycle: 2,
    })
  })

  it('resets the cycle after a long break', () => {
    expect(getNextMode(MODES.longBreak, 4)).toEqual({
      mode: MODES.pomodoro,
      pomodorosInCycle: 0,
    })
  })

  it('keeps the cycle count through a short break', () => {
    expect(getNextMode(MODES.shortBreak, 2)).toEqual({
      mode: MODES.pomodoro,
      pomodorosInCycle: 2,
    })
  })
})

describe('getSkipTransition', () => {
  it('does not count a skipped focus round', () => {
    expect(getSkipTransition(MODES.pomodoro, 0)).toEqual({
      mode: MODES.shortBreak,
      pomodorosInCycle: 0,
    })
  })

  it('resets the cycle when a long break is skipped', () => {
    expect(getSkipTransition(MODES.longBreak, 4)).toEqual({
      mode: MODES.pomodoro,
      pomodorosInCycle: 0,
    })
  })

  it('returns to focus from a short break', () => {
    expect(getSkipTransition(MODES.shortBreak, 2)).toEqual({
      mode: MODES.pomodoro,
      pomodorosInCycle: 2,
    })
  })

  it('respects a custom interval when skipping', () => {
    expect(getSkipTransition(MODES.pomodoro, 2, 2)).toEqual({
      mode: MODES.longBreak,
      pomodorosInCycle: 2,
    })
  })
})

describe('getRemainingFraction', () => {
  it('returns the share of time left', () => {
    expect(getRemainingFraction(60_000, 60_000)).toBe(1)
    expect(getRemainingFraction(30_000, 60_000)).toBe(0.5)
    expect(getRemainingFraction(0, 60_000)).toBe(0)
  })

  it('clamps invalid values', () => {
    expect(getRemainingFraction(-1_000, 60_000)).toBe(0)
    expect(getRemainingFraction(90_000, 60_000)).toBe(1)
    expect(getRemainingFraction(30_000, 0)).toBe(0)
  })
})

describe('resolveTheme', () => {
  it('resolves system preference', () => {
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('system', false)).toBe('light')
  })

  it('keeps explicit themes', () => {
    expect(resolveTheme('dark', false)).toBe('dark')
    expect(resolveTheme('light', true)).toBe('light')
  })
})
