import { useTranslation } from 'react-i18next'
import { MODE_LIST } from '../constants/modes'
import { useTimerStore } from '../store/timerStore'
import Segmented from './ui/Segmented'

export default function ModeTabs() {
  const { t } = useTranslation()
  const mode = useTimerStore((state) => state.mode)
  const setMode = useTimerStore((state) => state.setMode)

  const options = MODE_LIST.map((value) => ({ value, label: t(`modes.${value}`) }))

  return (
    <Segmented
      options={options}
      value={mode}
      onChange={setMode}
      ariaLabel={t('timer.modeTabsLabel')}
      className="mx-auto max-w-sm"
    />
  )
}
