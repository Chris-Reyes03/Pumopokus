import { create } from 'zustand'
import { SUBJECT_COLORS } from '../constants/subjects'
import { loadTaskState, saveTaskState } from '../services/storage'
import { createId } from '../utils/id'
import { MAX_SUBJECT_NAME, MAX_TASK_NAME, clampEstimate, pickTaskState } from '../utils/tasks'

const initialTaskState = loadTaskState()

function cleanName(value, maxLength) {
  if (typeof value !== 'string') return ''
  return value.trim().replace(/\s+/g, ' ').slice(0, maxLength)
}

export const useTaskStore = create((set, get) => {
  const commit = (patch) => {
    set(patch)
    saveTaskState(pickTaskState(get()))
  }

  return {
    ...initialTaskState,

    addTask: ({ name, subjectId, estimate } = {}) => {
      const clean = cleanName(name, MAX_TASK_NAME)
      if (!clean) return null

      const task = {
        id: createId('task'),
        name: clean,
        subjectId: get().subjects.some((subject) => subject.id === subjectId) ? subjectId : null,
        estimate: clampEstimate(estimate),
        completedPomodoros: 0,
        done: false,
        createdAt: new Date().toISOString(),
      }

      commit({
        tasks: [...get().tasks, task],
        activeTaskId: get().activeTaskId ?? task.id,
      })
      return task
    },

    updateTask: (id, patch = {}) => {
      const task = get().tasks.find((item) => item.id === id)
      if (!task) return

      const name = patch.name === undefined ? task.name : cleanName(patch.name, MAX_TASK_NAME)
      const subjectId =
        patch.subjectId === undefined
          ? task.subjectId
          : get().subjects.some((subject) => subject.id === patch.subjectId)
            ? patch.subjectId
            : null
      const estimate = patch.estimate === undefined ? task.estimate : clampEstimate(patch.estimate)

      commit({
        tasks: get().tasks.map((item) =>
          item.id === id ? { ...item, name: name || item.name, subjectId, estimate } : item,
        ),
      })
    },

    deleteTask: (id) => {
      commit({
        tasks: get().tasks.filter((task) => task.id !== id),
        activeTaskId: get().activeTaskId === id ? null : get().activeTaskId,
      })
    },

    toggleDone: (id) => {
      const task = get().tasks.find((item) => item.id === id)
      if (!task) return
      const done = !task.done

      commit({
        tasks: get().tasks.map((item) => (item.id === id ? { ...item, done } : item)),
        activeTaskId: done && get().activeTaskId === id ? null : get().activeTaskId,
      })
    },

    setActiveTask: (id) => {
      if (id == null || get().activeTaskId === id) {
        commit({ activeTaskId: null })
        return
      }
      const task = get().tasks.find((item) => item.id === id)
      if (!task || task.done) return
      commit({ activeTaskId: id })
    },

    incrementCompleted: (id) => {
      if (!get().tasks.some((task) => task.id === id)) return
      commit({
        tasks: get().tasks.map((task) =>
          task.id === id ? { ...task, completedPomodoros: task.completedPomodoros + 1 } : task,
        ),
      })
    },

    addSubject: ({ name, color } = {}) => {
      const clean = cleanName(name, MAX_SUBJECT_NAME)
      if (!clean) return null

      const existing = get().subjects.find(
        (subject) => !subject.nameKey && subject.name.toLowerCase() === clean.toLowerCase(),
      )
      if (existing) return existing

      const subject = {
        id: createId('subj'),
        name: clean,
        color: SUBJECT_COLORS.includes(color) ? color : SUBJECT_COLORS[0],
      }

      commit({ subjects: [...get().subjects, subject] })
      return subject
    },
  }
})
