import { beforeEach, describe, expect, it } from 'vitest'
import { STORAGE_KEYS } from '../services/storage'
import { getDefaultTaskState } from '../utils/tasks'
import { useTaskStore } from './taskStore'

function resetStore() {
  localStorage.clear()
  useTaskStore.setState(getDefaultTaskState())
}

describe('taskStore', () => {
  beforeEach(resetStore)

  it('adds a task as the active task and persists it', () => {
    const task = useTaskStore.getState().addTask({
      name: '  Lab report  ',
      subjectId: 'science',
      estimate: 3,
    })

    expect(task).toMatchObject({
      name: 'Lab report',
      subjectId: 'science',
      estimate: 3,
      completedPomodoros: 0,
      done: false,
    })
    expect(useTaskStore.getState().activeTaskId).toBe(task.id)

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.tasks))
    expect(saved.data.tasks[0].id).toBe(task.id)
  })

  it('counts completed pomodoros and clears the active task when done', () => {
    const task = useTaskStore
      .getState()
      .addTask({ name: 'Read', subjectId: 'english', estimate: 2 })

    useTaskStore.getState().incrementCompleted(task.id)
    expect(useTaskStore.getState().tasks[0].completedPomodoros).toBe(1)

    useTaskStore.getState().toggleDone(task.id)
    expect(useTaskStore.getState().tasks[0].done).toBe(true)
    expect(useTaskStore.getState().activeTaskId).toBeNull()
  })

  it('toggles the active task and ignores done tasks', () => {
    const task = useTaskStore.getState().addTask({ name: 'One', subjectId: 'math', estimate: 1 })

    useTaskStore.getState().setActiveTask(task.id)
    expect(useTaskStore.getState().activeTaskId).toBeNull()

    useTaskStore.getState().toggleDone(task.id)
    useTaskStore.getState().setActiveTask(task.id)
    expect(useTaskStore.getState().activeTaskId).toBeNull()
  })

  it('adds custom subjects once and attaches them to tasks', () => {
    const subject = useTaskStore.getState().addSubject({ name: 'Chemistry', color: '#7a4fb3' })
    expect(subject).toMatchObject({ name: 'Chemistry', color: '#7a4fb3' })

    const duplicate = useTaskStore.getState().addSubject({
      name: 'chemistry',
      color: '#2f8abf',
    })
    expect(duplicate.id).toBe(subject.id)
    expect(useTaskStore.getState().subjects.filter((item) => item.id === subject.id)).toHaveLength(
      1,
    )

    const task = useTaskStore.getState().addTask({
      name: 'Titration',
      subjectId: subject.id,
      estimate: 1,
    })
    expect(task.subjectId).toBe(subject.id)
  })

  it('deletes a task and clears it from the active slot', () => {
    const task = useTaskStore.getState().addTask({ name: 'One', subjectId: 'math', estimate: 1 })

    useTaskStore.getState().deleteTask(task.id)

    expect(useTaskStore.getState().tasks).toEqual([])
    expect(useTaskStore.getState().activeTaskId).toBeNull()
  })
})
