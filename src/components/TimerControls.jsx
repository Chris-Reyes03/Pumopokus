import { useTranslation } from 'react-i18next'
import { useTimerStore } from '../store/timerStore'
import { PauseIcon, PlayIcon, ResetIcon, SkipIcon } from './icons'
import Button from './ui/Button'

export default function TimerControls() {
  const { t } = useTranslation()
  const status = useTimerStore((state) => state.status)
  const toggle = useTimerStore((state) => state.toggle)
  const reset = useTimerStore((state) => state.reset)
  const skip = useTimerStore((state) => state.skip)

  const isRunning = status === 'running'
  const primaryLabel =
    status === 'running'
      ? t('timer.pause')
      : status === 'paused'
        ? t('timer.resume')
        : t('timer.start')

  const handlePrimary = () => {
    if (!isRunning) {
      import('../services/chime').then(({ primeChime }) => primeChime()).catch(() => undefined)
    }
    toggle()
  }

  return (
    <div className="mt-5 flex items-center justify-center gap-2 sm:mt-6 sm:gap-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={reset}
        aria-label={t('timer.reset')}
        title={t('timer.reset')}
        className="rounded-full"
      >
        <ResetIcon />
      </Button>

      <Button
        size="lg"
        onClick={handlePrimary}
        className="min-w-36 rounded-2xl uppercase tracking-wide sm:min-w-40"
      >
        {isRunning ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4" />}
        {primaryLabel}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={skip}
        aria-label={t('timer.skip')}
        title={t('timer.skip')}
        className="rounded-full"
      >
        <SkipIcon />
      </Button>
    </div>
  )
}
