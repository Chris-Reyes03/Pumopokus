import { beforeEach, describe, expect, it } from 'vitest'
import { STORAGE_KEYS, loadSettings, readVersioned, writeVersioned } from './storage'
import { STORAGE_SCHEMA_VERSION } from './storage'

describe('versioned storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('round-trips data with a schema version', () => {
    expect(writeVersioned('test.key', { hello: 'world' })).toBe(true)
    expect(readVersioned('test.key')).toEqual({ hello: 'world' })

    const envelope = JSON.parse(localStorage.getItem('test.key'))
    expect(envelope.schemaVersion).toBe(STORAGE_SCHEMA_VERSION)
    expect(envelope.data).toEqual({ hello: 'world' })
  })

  it('returns null for missing, corrupt, or old data', () => {
    expect(readVersioned('missing')).toBeNull()

    localStorage.setItem('corrupt', '{not json')
    expect(readVersioned('corrupt')).toBeNull()

    localStorage.setItem('old', JSON.stringify({ schemaVersion: 0, data: { a: 1 } }))
    expect(readVersioned('old')).toBeNull()

    localStorage.setItem('plain', JSON.stringify({ a: 1 }))
    expect(readVersioned('plain')).toBeNull()
  })

  it('loads normalized settings and falls back after corrupt data', () => {
    writeVersioned(STORAGE_KEYS.settings, {
      durations: { pomodoro: 50, shortBreak: 10, longBreak: 20 },
      longBreakInterval: 3,
      autoStart: { breaks: true, pomodoros: false },
      theme: 'dark',
      language: 'fil',
    })

    const settings = loadSettings()
    expect(settings.durations.pomodoro).toBe(50)
    expect(settings.longBreakInterval).toBe(3)
    expect(settings.theme).toBe('dark')
    expect(settings.language).toBe('fil')
    expect(settings.soundVolumes.chime).toBe(0.6)

    localStorage.setItem(STORAGE_KEYS.settings, 'broken')
    expect(loadSettings().durations.pomodoro).toBe(25)
  })
})
