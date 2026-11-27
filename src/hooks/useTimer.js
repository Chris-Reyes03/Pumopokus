import { useEffect } from 'react'
import { MODES } from '../constants/modes'
import { showRoundEndNotification } from '../services/notifications'
import { useRewardStore } from '../store/rewardStore'
import { useSessionStore } from '../store/sessionStore'
import { useSettingsStore } from '../store/settingsStore'
import { useTaskStore } from '../store/taskStore'
import { useTimerStore } from '../store/timerStore'
import { createId } from '../utils/id'
import { getRandomQuote } from '../utils/quotes'

function recordCompletedFocus(state) {
  const endedAt = new Date()
  const taskState = useTaskStore.getState()
  const activeTask = taskState.tasks.find((task) => task.id === taskState.activeTaskId) ?? null

  useSessionStore.getState().logSession({
    id: createId('session'),
    startedAt: new Date(state.startedAt ?? endedAt.getTime() - state.durationMs).toISOString(),
    endedAt: endedAt.toISOString(),
    minutes: Math.max(1, Math.round(state.durationMs / 60_000)),
    subjectId: activeTask?.subjectId ?? null,
    taskId: activeTask?.id ?? null,
    mode: MODES.pomodoro,
  })

  if (activeTask) taskState.incrementCompleted(activeTask.id)
  useRewardStore.getState().show(getRandomQuote())
}

export function useTimer() {
  const status = useTimerStore((state) => state.status)

  useEffect(() => {
    if (status !== 'running') return undefined

    const check = () => {
      const state = useTimerStore.getState()
      if (state.status !== 'running' || !state.endAt) return

      const remainingMs = state.endAt - Date.now()
      if (remainingMs > 0) {
        state.setRemaining(remainingMs)
        return
      }

      const completed = state.finishRound()
      if (completed?.completedMode === MODES.pomodoro) recordCompletedFocus(state)
      import('../services/chime')
        .then(({ playChime }) => playChime(useSettingsStore.getState().soundVolumes.chime))
        .catch(() => undefined)

      if (completed) {
        const { notificationsEnabled } = useSettingsStore.getState()
        showRoundEndNotification({
          ...completed,
          enabled: notificationsEnabled,
          visibility: document.visibilityState,
        }).catch(() => undefined)
      }
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') check()
    }

    const intervalId = window.setInterval(check, 250)
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('focus', check)
    check()

    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('focus', check)
    }
  }, [status])

  useEffect(
    () =>
      useSettingsStore.subscribe((state, previousState) => {
        if (state.durations === previousState.durations) return
        useTimerStore.getState().syncDurations(state.durations)
      }),
    [],
  )
}
