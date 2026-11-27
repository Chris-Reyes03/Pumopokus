import { describe, expect, it } from 'vitest'
import { normalizeSessions, pickSessionState } from './sessions'

const valid = {
  id: 's1',
  startedAt: '2026-01-05T08:00:00.000Z',
  endedAt: '2026-01-05T08:25:00.000Z',
  minutes: 25,
  subjectId: 'math',
  taskId: 't1',
  mode: 'pomodoro',
}

describe('session normalization', () => {
  it('keeps valid sessions from an array or a storage envelope', () => {
    expect(normalizeSessions([valid])).toEqual([valid])
    expect(normalizeSessions({ sessions: [valid] })).toEqual([valid])
  })

  it('drops sessions with bad dates, minutes, or ids', () => {
    const sessions = normalizeSessions([
      { ...valid, id: '' },
      { ...valid, id: 's2', startedAt: 'not-a-date' },
      { ...valid, id: 's3', endedAt: undefined },
      { ...valid, id: 's4', minutes: 0 },
      { ...valid, id: 's5', minutes: 'lots' },
      null,
      'nope',
    ])

    expect(sessions).toEqual([])
  })

  it('rounds minutes and normalizes optional ids', () => {
    const [session] = normalizeSessions([
      { ...valid, minutes: 25.6, subjectId: 42, taskId: undefined, mode: undefined },
    ])

    expect(session.minutes).toBe(26)
    expect(session.subjectId).toBeNull()
    expect(session.taskId).toBeNull()
    expect(session.mode).toBe('pomodoro')
  })

  it('picks only the sessions list for persistence', () => {
    expect(pickSessionState({ sessions: [valid], extra: true })).toEqual({ sessions: [valid] })
  })
})
