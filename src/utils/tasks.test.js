import { describe, expect, it } from 'vitest'
import { DEFAULT_SUBJECTS } from '../constants/subjects'
import { clampEstimate, normalizeSubjects, normalizeTaskState, normalizeTasks } from './tasks'

describe('task data normalization', () => {
  it('keeps built-in subjects and adds valid custom ones', () => {
    const subjects = normalizeSubjects([
      { id: 'math', name: 'Hacked', color: '#000000' },
      { id: 'chem', name: '  Chemistry  ', color: '#7a4fb3' },
      { id: 'bad', name: '', color: 'nope' },
      { name: 'No id', color: '#ffffff' },
    ])

    expect(subjects.slice(0, DEFAULT_SUBJECTS.length).map((subject) => subject.id)).toEqual(
      DEFAULT_SUBJECTS.map((subject) => subject.id),
    )
    expect(subjects.find((subject) => subject.id === 'chem')).toEqual({
      id: 'chem',
      name: 'Chemistry',
      color: '#7a4fb3',
    })
    expect(subjects.some((subject) => subject.id === 'bad')).toBe(false)
  })

  it('clamps estimates and drops invalid tasks', () => {
    const tasks = normalizeTasks(
      [
        {
          id: 't1',
          name: '  Read  ',
          subjectId: 'math',
          estimate: 500,
          completedPomodoros: 2.7,
          done: 1,
          createdAt: '2026-01-01T00:00:00.000Z',
        },
        { id: 't2', name: '', subjectId: 'math', estimate: 1 },
        { id: 't3', name: 'No subject', subjectId: 'ghost', estimate: 0 },
      ],
      ['math'],
    )

    expect(tasks).toHaveLength(2)
    expect(tasks[0]).toMatchObject({
      id: 't1',
      name: 'Read',
      subjectId: 'math',
      estimate: 99,
      completedPomodoros: 2,
      done: true,
    })
    expect(tasks[1]).toMatchObject({ id: 't3', subjectId: null, estimate: 1 })
  })

  it('clears an active task that is done or missing', () => {
    const done = normalizeTaskState({
      tasks: [{ id: 't1', name: 'One', done: true }],
      activeTaskId: 't1',
    })
    expect(done.activeTaskId).toBeNull()

    const missing = normalizeTaskState({
      tasks: [{ id: 't1', name: 'One', done: false }],
      activeTaskId: 'nope',
    })
    expect(missing.activeTaskId).toBeNull()

    const active = normalizeTaskState({
      tasks: [{ id: 't1', name: 'One', done: false }],
      activeTaskId: 't1',
    })
    expect(active.activeTaskId).toBe('t1')
  })

  it('falls back to defaults for garbage and clamps estimates', () => {
    expect(normalizeTaskState(null).tasks).toEqual([])
    expect(normalizeTaskState('nope').subjects.length).toBe(DEFAULT_SUBJECTS.length)
    expect(clampEstimate(0)).toBe(1)
    expect(clampEstimate(1000)).toBe(99)
    expect(clampEstimate('4')).toBe(4)
    expect(clampEstimate('x', 2)).toBe(2)
  })
})
