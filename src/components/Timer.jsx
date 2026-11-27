import { useTranslation } from 'react-i18next'
import { useTimerStore } from '../store/timerStore'
import { formatTime, getRemainingFraction } from '../utils/timer'

const RADIUS = 132
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function Timer() {
  const { t } = useTranslation()
  const mode = useTimerStore((state) => state.mode)
  const status = useTimerStore((state) => state.status)
  const remainingMs = useTimerStore((state) => state.remainingMs)
  const durationMs = useTimerStore((state) => state.durationMs)

  const time = formatTime(remainingMs)
  const remainingFraction = getRemainingFraction(remainingMs, durationMs)
  const modeLabel = t(`modes.${mode}`)

  const announcementKey =
    status === 'running'
      ? 'timer.announcement.running'
      : status === 'paused'
        ? 'timer.announcement.paused'
        : 'timer.announcement.ready'

  return (
    <div className="relative mx-auto mt-4 w-[min(74vw,34svh,17rem)] sm:mt-5">
      <svg viewBox="0 0 300 300" className="size-full -rotate-90" aria-hidden="true">
        <circle
          cx="150"
          cy="150"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-white/15"
        />
        <circle
          cx="150"
          cy="150"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - remainingFraction)}
          className="text-on-page"
          style={{ transition: 'stroke-dashoffset 1200ms linear' }}
        />
      </svg>

      <div className="absolute inset-0 grid place-items-center">
        <div
          role="timer"
          aria-label={t('timer.remainingLabel', { mode: modeLabel, time })}
          className="font-display text-[min(21vw,10svh,4.9rem)] font-semibold leading-none tracking-tight tabular-nums"
        >
          {time}
        </div>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {t(announcementKey, { mode: modeLabel })}
      </p>
    </div>
  )
}
