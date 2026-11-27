import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTimerStore } from '../store/timerStore'
import { formatTime } from '../utils/timer'

export function useDocumentTitle() {
  const { t } = useTranslation()
  const status = useTimerStore((state) => state.status)
  const remainingMs = useTimerStore((state) => state.remainingMs)
  const mode = useTimerStore((state) => state.mode)

  useEffect(() => {
    if (status === 'idle') {
      document.title = t('timer.idleTitle')
      return
    }

    document.title = t('timer.documentTitle', {
      time: formatTime(remainingMs),
      mode: t(`modes.${mode}`),
    })
  }, [mode, remainingMs, status, t])
}
