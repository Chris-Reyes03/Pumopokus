import { useMemo } from 'react'
import { useSessionStore } from '../store/sessionStore'
import { buildHeatmap, computeStreaks, HEATMAP_WEEKS } from '../utils/stats'

export function useFocusStats(weeks = HEATMAP_WEEKS) {
  const sessions = useSessionStore((state) => state.sessions)

  return useMemo(() => {
    const heatmap = buildHeatmap(sessions, { weeks })
    const streaks = computeStreaks(sessions)

    return {
      weeks: heatmap.weeks,
      totalMinutes: heatmap.totalMinutes,
      totalPomodoros: heatmap.totalPomodoros,
      activeDaysInRange: heatmap.activeDays,
      todayKey: streaks.todayKey,
      todayMinutes: streaks.todayMinutes,
      current: streaks.current,
      longest: streaks.longest,
      activeDays: streaks.activeDays,
    }
  }, [sessions, weeks])
}
