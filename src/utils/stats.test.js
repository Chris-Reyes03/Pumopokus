import { describe, expect, it } from 'vitest'
import {
  aggregateDaily,
  buildHeatmap,
  computeStreaks,
  getLevelForMinutes,
  getLocalDayKey,
  parseDayKey,
  shiftDayKey,
} from './stats'

let sessionCounter = 0

function sessionAt(date, minutes = 25, mode = 'pomodoro') {
  sessionCounter += 1
  return {
    id: `session-${sessionCounter}`,
    startedAt: new Date(date.getTime() - minutes * 60 * 1000).toISOString(),
    endedAt: date.toISOString(),
    minutes,
    subjectId: null,
    taskId: null,
    mode,
  }
}

function day(date) {
  return sessionAt(date, 25)
}

describe('getLocalDayKey', () => {
  it('uses the local calendar day, not the UTC day', () => {
    expect(getLocalDayKey(new Date(2026, 0, 5, 0, 30))).toBe('2026-01-05')
    expect(getLocalDayKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05')
    expect(getLocalDayKey(new Date(2026, 0, 6, 0, 1))).toBe('2026-01-06')
  })

  it('round-trips through ISO strings without crossing the local day', () => {
    const date = new Date(2026, 4, 9, 0, 15)
    expect(getLocalDayKey(date.toISOString())).toBe('2026-05-09')
  })

  it('shifts across month and year boundaries', () => {
    expect(shiftDayKey('2026-01-01', -1)).toBe('2025-12-31')
    expect(shiftDayKey('2024-02-28', 1)).toBe('2024-02-29')
    expect(shiftDayKey('2024-02-29', 1)).toBe('2024-03-01')
  })

  it('rejects invalid dates', () => {
    expect(getLocalDayKey('not-a-date')).toBeNull()
  })
})

describe('aggregateDaily', () => {
  it('groups focus minutes by local day and attributes midnight sessions to the new day', () => {
    const daily = aggregateDaily([
      sessionAt(new Date(2026, 0, 5, 23, 59), 20),
      sessionAt(new Date(2026, 0, 6, 0, 1), 25),
      sessionAt(new Date(2026, 0, 6, 14, 0), 15),
    ])

    expect(daily.get('2026-01-05')).toEqual({ minutes: 20, pomodoros: 1 })
    expect(daily.get('2026-01-06')).toEqual({ minutes: 40, pomodoros: 2 })
  })

  it('ignores breaks and malformed sessions', () => {
    const daily = aggregateDaily([
      sessionAt(new Date(2026, 0, 5, 10), 5, 'shortBreak'),
      null,
      { endedAt: 'nope', mode: 'pomodoro', minutes: 25 },
    ])

    expect(daily.size).toBe(0)
  })

  it('handles empty input', () => {
    expect(aggregateDaily([]).size).toBe(0)
    expect(aggregateDaily(undefined).size).toBe(0)
  })
})

describe('computeStreaks', () => {
  it('counts consecutive days ending today', () => {
    const sessions = [
      day(new Date(2026, 0, 1, 12)),
      day(new Date(2026, 0, 2, 12)),
      day(new Date(2026, 0, 3, 12)),
      day(new Date(2026, 0, 5, 12)),
      day(new Date(2026, 0, 6, 12)),
      day(new Date(2026, 0, 7, 12)),
    ]

    expect(computeStreaks(sessions, new Date(2026, 0, 7, 18))).toMatchObject({
      current: 3,
      longest: 3,
      activeDays: 6,
    })
  })

  it('keeps yesterday’s streak alive until today ends', () => {
    const sessions = [day(new Date(2026, 0, 5, 12)), day(new Date(2026, 0, 6, 12))]

    expect(computeStreaks(sessions, new Date(2026, 0, 7, 9))).toMatchObject({
      current: 2,
      longest: 2,
    })
  })

  it('returns zero when neither today nor yesterday is active', () => {
    const sessions = [day(new Date(2026, 0, 4, 12)), day(new Date(2026, 0, 5, 12))]

    expect(computeStreaks(sessions, new Date(2026, 0, 7, 9))).toMatchObject({
      current: 0,
      longest: 2,
    })
  })

  it('tracks the longest run separately from the current run', () => {
    const sessions = [
      day(new Date(2026, 0, 1, 12)),
      day(new Date(2026, 0, 2, 12)),
      day(new Date(2026, 0, 3, 12)),
      day(new Date(2026, 0, 4, 12)),
      day(new Date(2026, 0, 5, 12)),
      day(new Date(2026, 0, 10, 12)),
    ]

    expect(computeStreaks(sessions, new Date(2026, 0, 10, 20))).toMatchObject({
      current: 1,
      longest: 5,
    })
  })

  it('handles empty data', () => {
    expect(computeStreaks([], new Date(2026, 0, 7, 12))).toMatchObject({
      current: 0,
      longest: 0,
      activeDays: 0,
      todayMinutes: 0,
    })
  })

  it('reports today’s focus minutes', () => {
    const sessions = [
      sessionAt(new Date(2026, 0, 7, 10), 25),
      sessionAt(new Date(2026, 0, 7, 11), 25),
    ]

    expect(computeStreaks(sessions, new Date(2026, 0, 7, 20)).todayMinutes).toBe(50)
  })
})

describe('buildHeatmap', () => {
  const now = new Date(2026, 0, 7, 12)

  it('builds 26 Monday-to-Sunday weeks ending with the current week', () => {
    const data = buildHeatmap([], { now })

    expect(data.weeks).toHaveLength(26)
    expect(data.todayKey).toBe('2026-01-07')
    data.weeks.forEach((week) => expect(week.days).toHaveLength(7))

    const lastWeek = data.weeks[25]
    expect(lastWeek.days[0].key).toBe('2026-01-05')
    expect(lastWeek.days[2].key).toBe('2026-01-07')
    expect(lastWeek.days[2].future).toBe(false)
    expect(lastWeek.days[3].future).toBe(true)
    expect(lastWeek.days[3].level).toBe(-1)
  })

  it('totals only days inside the range and before today', () => {
    const sessions = [
      day(new Date(2025, 6, 1, 12)),
      day(new Date(2026, 0, 6, 12)),
      day(new Date(2026, 0, 7, 12)),
      day(new Date(2026, 0, 8, 12)),
    ]
    const data = buildHeatmap(sessions, { now })
    const startKey = data.weeks[0].days[0].key

    const expected = sessions.filter((session) => {
      const key = getLocalDayKey(session.endedAt)
      return key >= startKey && key <= data.todayKey
    })

    expect(data.totalMinutes).toBe(expected.length * 25)
    expect(data.totalPomodoros).toBe(expected.length)
    expect(data.activeDays).toBe(expected.length)
  })

  it('assigns intensity levels by daily minutes', () => {
    expect(getLevelForMinutes(0)).toBe(0)
    expect(getLevelForMinutes(10)).toBe(1)
    expect(getLevelForMinutes(20)).toBe(2)
    expect(getLevelForMinutes(45)).toBe(3)
    expect(getLevelForMinutes(90)).toBe(4)

    const data = buildHeatmap([sessionAt(new Date(2026, 0, 7, 12), 50)], { now })
    const todayCell = data.weeks.at(-1).days.find((cell) => cell.key === data.todayKey)
    expect(todayCell).toMatchObject({ minutes: 50, pomodoros: 1, level: 3 })
  })

  it('keeps grid dates stable across month boundaries', () => {
    const data = buildHeatmap([], { now: new Date(2026, 2, 2, 9) })
    const flatKeys = data.weeks.flatMap((week) => week.days.map((cell) => cell.key))

    expect(flatKeys).toContain('2026-02-28')
    expect(flatKeys).toContain('2026-03-01')
    expect(parseDayKey(flatKeys[0]).getDay()).toBe(1)
  })
})
