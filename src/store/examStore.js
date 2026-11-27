import { create } from 'zustand'
import { loadExam, saveExam } from '../services/storage'
import { normalizeExamDate } from '../utils/reports'

const initialExam = loadExam()

export const useExamStore = create((set) => ({
  date: initialExam.date,
  setDate: (value) => {
    const date = normalizeExamDate(value)
    set({ date })
    saveExam({ date })
  },
}))
