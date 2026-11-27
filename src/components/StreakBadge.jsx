import { useTranslation } from 'react-i18next'
import { useFocusStats } from '../hooks/useFocusStats'
import { SproutIcon } from './icons'

export default function StreakBadge() {
  const { t } = useTranslation()
  const { current } = useFocusStats()

  return (
    <div className="mb-3 flex justify-center">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-on-page-muted">
        <SproutIcon className="size-3.5" />
        {current > 0 ? t('streak.badge', { count: current }) : t('streak.start')}
      </span>
    </div>
  )
}
