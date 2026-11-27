import { useMemo } from 'react'
import { useSessionStore } from '../store/sessionStore'
import {
  buildSubjectReport,
  buildWeeklyReport,
  getRecentSessions,
  groupSessionsByDay,
} from '../utils/reports'

export function useReports() {
  const sessions = useSessionStore((state) => state.sessions)

  return useMemo(() => {
    const weekly = buildWeeklyReport(sessions)
    const recent = getRecentSessions(sessions, 20)

    return {
      weekly,
      subjects: buildSubjectReport(sessions, { days: 30 }),
      history: groupSessionsByDay(recent),
    }
  }, [sessions])
}
