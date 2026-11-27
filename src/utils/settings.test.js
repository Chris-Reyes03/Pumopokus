import { describe, expect, it } from 'vitest'
import {
  clampInterval,
  clampMinutes,
  clampVolume,
  detectLanguage,
  getDefaultSettings,
  normalizeSettings,
  pickSettings,
} from './settings'

describe('clampMinutes', () => {
  it('enforces the 1 to 90 minute range', () => {
    expect(clampMinutes(0, 25)).toBe(1)
    expect(clampMinutes(500, 25)).toBe(90)
    expect(clampMinutes(-3, 25)).toBe(1)
  })

  it('rounds decimals and coerces numeric strings', () => {
    expect(clampMinutes(12.6, 25)).toBe(13)
    expect(clampMinutes('7', 25)).toBe(7)
  })

  it('falls back for invalid values', () => {
    expect(clampMinutes('abc', 25)).toBe(25)
    expect(clampMinutes(undefined, 15)).toBe(15)
    expect(clampMinutes(Number.NaN, 5)).toBe(5)
  })
})

describe('clampInterval', () => {
  it('enforces the 1 to 12 focus-session range', () => {
    expect(clampInterval(0)).toBe(1)
    expect(clampInterval(20)).toBe(12)
    expect(clampInterval(2.6)).toBe(3)
    expect(clampInterval('3')).toBe(3)
  })

  it('falls back for invalid values', () => {
    expect(clampInterval(undefined)).toBe(4)
    expect(clampInterval('many')).toBe(4)
  })
})

describe('clampVolume', () => {
  it('keeps volume between 0 and 1', () => {
    expect(clampVolume(2)).toBe(1)
    expect(clampVolume(-1)).toBe(0)
    expect(clampVolume('0.5')).toBe(0.5)
  })

  it('falls back for invalid values', () => {
    expect(clampVolume(undefined, 0.6)).toBe(0.6)
    expect(clampVolume('loud', 0.4)).toBe(0.4)
  })
})

describe('detectLanguage', () => {
  it('returns a supported language', () => {
    expect(['en', 'fil']).toContain(detectLanguage())
  })
})

describe('getDefaultSettings', () => {
  it('has the expected defaults', () => {
    const settings = getDefaultSettings('en')
    expect(settings).toEqual({
      durations: { pomodoro: 25, shortBreak: 5, longBreak: 15 },
      longBreakInterval: 4,
      autoStart: { breaks: false, pomodoros: false },
      language: 'en',
      theme: 'system',
      lightDataMode: false,
      soundVolumes: { chime: 0.6 },
      ambientVolumes: { rain: 0.5, ocean: 0, brown: 0 },
      notificationsEnabled: false,
    })
  })

  it('uses the provided language when supported', () => {
    expect(getDefaultSettings('fil').language).toBe('fil')
    expect(getDefaultSettings('de').language).toBe('en')
  })
})

describe('normalizeSettings', () => {
  it('returns defaults for empty or invalid input', () => {
    expect(normalizeSettings(null)).toEqual(getDefaultSettings())
    expect(normalizeSettings('nope')).toEqual(getDefaultSettings())
    expect(normalizeSettings(42)).toEqual(getDefaultSettings())
  })

  it('merges partial settings and clamps values', () => {
    const settings = normalizeSettings({
      durations: { pomodoro: 0, shortBreak: 7.4, longBreak: 999 },
      longBreakInterval: 30,
      autoStart: { breaks: true },
      theme: 'dark',
      language: 'fil',
      soundVolumes: { chime: 3 },
    })

    expect(settings.durations).toEqual({ pomodoro: 1, shortBreak: 7, longBreak: 90 })
    expect(settings.longBreakInterval).toBe(12)
    expect(settings.autoStart).toEqual({ breaks: true, pomodoros: false })
    expect(settings.theme).toBe('dark')
    expect(settings.language).toBe('fil')
    expect(settings.soundVolumes.chime).toBe(1)
  })

  it('clamps ambient volumes and fills missing tracks', () => {
    const settings = normalizeSettings({
      ambientVolumes: { rain: 2, ocean: -1, unknown: 0.5 },
    })

    expect(settings.ambientVolumes).toEqual({ rain: 1, ocean: 0, brown: 0 })
  })

  it('defaults a missing long-break interval for older saved settings', () => {
    expect(normalizeSettings({ theme: 'dark' }).longBreakInterval).toBe(4)
  })

  it('rejects unknown options and non-boolean flags', () => {
    const settings = normalizeSettings({
      theme: 'neon',
      language: 'xx',
      lightDataMode: 'yes',
      notificationsEnabled: 1,
      autoStart: { breaks: 'true' },
    })

    expect(settings.theme).toBe('system')
    expect(['en', 'fil']).toContain(settings.language)
    expect(settings.language).not.toBe('xx')
    expect(settings.lightDataMode).toBe(false)
    expect(settings.notificationsEnabled).toBe(false)
    expect(settings.autoStart.breaks).toBe(false)
  })

  it('handles corrupt nested objects', () => {
    const settings = normalizeSettings({
      durations: 'fast',
      autoStart: null,
      soundVolumes: [],
    })

    expect(settings.durations).toEqual({ pomodoro: 25, shortBreak: 5, longBreak: 15 })
    expect(settings.autoStart).toEqual({ breaks: false, pomodoros: false })
    expect(settings.soundVolumes.chime).toBe(0.6)
  })
})

describe('pickSettings', () => {
  it('takes only persisted settings fields', () => {
    const settings = getDefaultSettings('en')
    const picked = pickSettings({ ...settings, setTheme: () => undefined })

    expect(picked).toEqual(settings)
    expect(picked).not.toHaveProperty('setTheme')
  })
})
