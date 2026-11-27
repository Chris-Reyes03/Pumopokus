import { create } from 'zustand'
import { loadSessions, saveSessions } from '../services/storage'
import { normalizeSessions } from '../utils/sessions'

export const useSessionStore = create((set, get) => ({
  sessions: loadSessions(),

  logSession: (session) => {
    const [clean] = normalizeSessions([session])
    if (!clean) return null
    if (get().sessions.some((item) => item.id === clean.id)) return clean

    const sessions = [...get().sessions, clean]
    set({ sessions })
    saveSessions(sessions)
    return clean
  },
}))
