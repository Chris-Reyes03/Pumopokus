import { useTranslation } from 'react-i18next'
import { MAX_DURATION_MINUTES, MIN_DURATION_MINUTES } from '../../constants/modes'
import { MinusIcon, PlusIcon } from '../icons'
import StepButton from './StepButton'

export default function DurationField({ mode, label, value, onChange }) {
  const { t } = useTranslation()
  const inputId = `duration-${mode}`

  return (
    <div className="flex items-center justify-between gap-2 py-2">
      <label htmlFor={inputId} className="min-w-0 flex-1 text-sm font-medium">
        {label}
      </label>

      <div className="flex shrink-0 items-center gap-1.5">
        <StepButton
          label={t('settings.decrease', { label })}
          disabled={value <= MIN_DURATION_MINUTES}
          onClick={() => onChange(value - 1)}
        >
          <MinusIcon />
        </StepButton>

        <div className="flex items-baseline gap-1">
          <input
            id={inputId}
            type="number"
            inputMode="numeric"
            min={MIN_DURATION_MINUTES}
            max={MAX_DURATION_MINUTES}
            value={value}
            onChange={(event) => {
              if (event.target.value === '') return
              onChange(Number(event.target.value))
            }}
            className="w-11 appearance-none rounded-lg bg-on-paper/5 py-1.5 text-center font-display text-lg font-semibold text-on-paper [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <span className="text-xs text-on-paper-muted">{t('common.minutesShort')}</span>
        </div>

        <StepButton
          label={t('settings.increase', { label })}
          disabled={value >= MAX_DURATION_MINUTES}
          onClick={() => onChange(value + 1)}
        >
          <PlusIcon />
        </StepButton>
      </div>
    </div>
  )
}
