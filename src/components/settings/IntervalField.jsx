import { useTranslation } from 'react-i18next'
import { MAX_LONG_BREAK_INTERVAL, MIN_LONG_BREAK_INTERVAL } from '../../constants/modes'
import { MinusIcon, PlusIcon } from '../icons'
import StepButton from './StepButton'

export default function IntervalField({ value, onChange }) {
  const { t } = useTranslation()
  const inputId = 'long-break-interval'
  const descriptionId = 'long-break-interval-description'

  return (
    <div className="mt-1 flex items-center justify-between gap-2 border-t border-paper-line pt-4 pb-2">
      <div className="min-w-0 flex-1">
        <label htmlFor={inputId} className="text-sm font-medium">
          {t('settings.interval.label')}
        </label>
        <p id={descriptionId} className="mt-0.5 text-xs leading-5 text-on-paper-muted">
          {t('settings.interval.description')}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <StepButton
          label={t('settings.interval.decrease')}
          disabled={value <= MIN_LONG_BREAK_INTERVAL}
          onClick={() => onChange(value - 1)}
        >
          <MinusIcon />
        </StepButton>

        <input
          id={inputId}
          type="number"
          inputMode="numeric"
          min={MIN_LONG_BREAK_INTERVAL}
          max={MAX_LONG_BREAK_INTERVAL}
          value={value}
          aria-describedby={descriptionId}
          onChange={(event) => {
            if (event.target.value === '') return
            onChange(Number(event.target.value))
          }}
          className="w-10 appearance-none rounded-lg bg-on-paper/5 py-1.5 text-center font-display text-lg font-semibold text-on-paper [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />

        <StepButton
          label={t('settings.interval.increase')}
          disabled={value >= MAX_LONG_BREAK_INTERVAL}
          onClick={() => onChange(value + 1)}
        >
          <PlusIcon />
        </StepButton>
      </div>
    </div>
  )
}
