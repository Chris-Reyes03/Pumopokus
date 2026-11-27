import { describe, expect, it } from 'vitest'
import {
  buildSubjectReport,
  buildWeeklyReport,
  computeExamCountdown,
  getRecentSessions,
  groupSessionsByDay,
  normalizeExamDate,
} from './reports'

let counter = 0

function at(year, month, day, hour = 10, minute = 0) {
  return new Date(year, month - 1, day, hour, minute)
}

function session(endedAt, minutes = 25, extra = {}) {
  counter += 1
  return {
    id: `session-${counter}`,
    startedAt: new Date(endedAt.getTime() - minutes * 60000).toISOString(),
    endedAt: endedAt.toISOString(),
    minutes,
    subjectId: null,
    taskId: null,
    mode: 'pomodoro',
    ...extra,
  }
}

describe('normalizeExamDate', () => {
  it('keeps valid calendar dates', () => {
    expect(normalizeExamDate('2026-11-25')).toBe('2026-11-25')
    expect(normalizeExamDate('2028-02-29')).toBe('2028-02-29')
  })

  it('rejects malformed or impossible dates', () => {
    expect(normalizeExamDate('2026-02-30')).toBeNull()
    expect(normalizeExamDate('2026-13-01')).toBeNull()
    expect(normalizeExamDate('25-11-2026')).toBeNull()
    expect(normalizeExamDate('')).toBeNull()
    expect(normalizeExamDate(null)).toBeNull()
    expect(normalizeExamDate(20261125)).toBeNull()
  })
})

describe('computeExamCountdown', () => {
  const now = at(2026, 11, 25, 9)

  it('counts whole days into the future', () => {
    expect(computeExamCountdown('2026-12-01', now)).toEqual({ status: 'future', days: 6 })
  })

  it('handles today and past dates', () => {
    expect(computeExamCountdown('2026-11-25', now)).toEqual({ status: 'today', days: 0 })
    expect(computeExamCountdown('2026-11-20', now)).toEqual({ status: 'past', days: -5 })
  })

  it('returns none without a valid date', () => {
    expect(computeExamCountdown(null, now)).toEqual({ status: 'none', days: null })
    expect(computeExamCountdown('2026-02-30', now)).toEqual({ status: 'none', days: null })
  })
})

describe('buildWeeklyReport', () => {
  const now = at(2026, 1, 7, 12)
  const sessions = [
    session(at(2026, 1, 7), 25),
    session(at(2026, 1, 6, 11), 25),
    session(at(2026, 1, 6, 9), 25),
    session(at(2026, 1, 1), 15),
    session(at(2025, 12, 31), 100),
    session(at(2026, 1, 7, 13), 5, { mode: 'shortBreak' }),
  ]

  it('returns seven days ending today', () => {
    const report = buildWeeklyReport(sessions, now)
    expect(report.days).toHaveLength(7)
    expect(report.days[0].key).toBe('2026-01-01')
    expect(report.days[6].key).toBe('2026-01-07')
  })

  it('sums focus sessions inside the window only', () => {
    const report = buildWeeklyReport(sessions, now)
    expect(report.totalMinutes).toBe(90)
    expect(report.totalSessions).toBe(4)
    expect(report.maxMinutes).toBe(50)
    expect(report.days[5]).toEqual({ key: '2026-01-06', minutes: 50, sessions: 2 })
  })

  it('handles an empty week', () => {
    const report = buildWeeklyReport([], now)
    expect(report.totalMinutes).toBe(0)
    expect(report.totalSessions).toBe(0)
    expect(report.maxMinutes).toBe(1)
  })
})

describe('buildSubjectReport', () => {
  const now = at(2026, 1, 7, 12)
  const sessions = [
    session(at(2026, 1, 7), 25, { subjectId: 'math' }),
    session(at(2026, 1, 1), 25, { subjectId: 'math' }),
    session(at(2026, 1, 5), 25, { subjectId: 'science' }),
    session(at(2026, 1, 3), 15),
    session(at(2025, 12, 1), 100, { subjectId: 'math' }),
    session(at(2026, 1, 8), 100, { subjectId: 'science' }),
    session(at(2026, 1, 7, 13), 5, { subjectId: 'math', mode: 'longBreak' }),
  ]

  it('aggregates the last 30 days by subject, largest first', () => {
    const report = buildSubjectReport(sessions, { now })
    expect(report).toEqual([
      { subjectId: 'math', minutes: 50, sessions: 2 },
      { subjectId: 'science', minutes: 25, sessions: 1 },
      { subjectId: null, minutes: 15, sessions: 1 },
    ])
  })

  it('respects a custom window', () => {
    const report = buildSubjectReport(sessions, { days: 3, now })
    expect(report).toEqual([
      { subjectId: 'math', minutes: 25, sessions: 1 },
      { subjectId: 'science', minutes: 25, sessions: 1 },
    ])
  })
})

describe('getRecentSessions', () => {
  const sessions = [
    session(at(2026, 1, 1)),
    session(at(2026, 1, 3)),
    session(at(2026, 1, 2)),
    session(at(2026, 1, 4), 5, { mode: 'shortBreak' }),
    { id: 'bad', mode: 'pomodoro', endedAt: 'not-a-date' },
  ]

  it('returns newest focus sessions up to the limit', () => {
    const recent = getRecentSessions(sessions, 2)
    expect(recent.map((item) => item.endedAt)).toEqual([
      at(2026, 1, 3).toISOString(),
      at(2026, 1, 2).toISOString(),
    ])
  })
})

describe('groupSessionsByDay', () => {
  it('groups sorted sessions by local day', () => {
    const sorted = [
      session(at(2026, 1, 3, 12)),
      session(at(2026, 1, 3, 9)),
      session(at(2026, 1, 2, 18)),
    ]
    const groups = groupSessionsByDay(sorted)
    expect(groups.map((group) => group.key)).toEqual(['2026-01-03', '2026-01-02'])
    expect(groups[0].sessions).toHaveLength(2)
    expect(groups[1].sessions).toHaveLength(1)
  })

  it('skips invalid entries', () => {
    expect(groupSessionsByDay([{ endedAt: 'nope' }, null])).toEqual([])
  })
})
