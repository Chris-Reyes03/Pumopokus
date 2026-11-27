import { useTranslation } from 'react-i18next'
import { useOutletContext } from 'react-router'
import AmbientMixer from '../components/AmbientMixer'
import SiteFooter from '../components/landing/SiteFooter'
import StudyGuide from '../components/landing/StudyGuide'
import ReportsPanel from '../components/ReportsPanel'
import StatsPanel from '../components/StatsPanel'
import StreakBadge from '../components/StreakBadge'
import TaskList from '../components/tasks/TaskList'
import ModeTabs from '../components/ModeTabs'
import Timer from '../components/Timer'
import TimerControls from '../components/TimerControls'
import { CalyxMark, ChevronDownIcon } from '../components/icons'
import { useSpacebar } from '../hooks/useSpacebar'
import { useTimerStore } from '../store/timerStore'

export default function Home() {
  const { t } = useTranslation()
  const { openSettings } = useOutletContext()
  const toggle = useTimerStore((state) => state.toggle)

  useSpacebar(toggle)

  return (
    <div>
      <section id="timer" className="relative">
        <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-3xl flex-col items-center justify-center px-4 py-6 sm:px-6">
          <h1 className="sr-only">{t('landing.pageTitle')}</h1>

          <div className="w-full max-w-[30rem]">
            <StreakBadge />
            <section className="relative rounded-card bg-surface p-4 shadow-card ring-1 ring-white/10 sm:p-6">
              <CalyxMark className="absolute left-1/2 top-0 size-8 -translate-x-1/2 -translate-y-1/2 text-leaf" />
              <ModeTabs />
              <Timer />
              <TimerControls />
              <p className="mt-3 hidden text-center text-xs text-on-page-muted sm:block">
                {t('timer.spaceHint')}
              </p>
            </section>
          </div>

          <a
            href="#guide"
            className="mt-4 inline-flex items-center gap-1 rounded-md text-sm font-medium text-on-page-muted transition-colors hover:text-on-page"
          >
            {t('landing.guideLink')}
            <ChevronDownIcon className="size-4" />
          </a>
        </div>
      </section>

      <div className="paper-scope bg-paper text-on-paper">
        <TaskList />
        <AmbientMixer />
        <StatsPanel />
        <ReportsPanel />
        <StudyGuide />
        <SiteFooter onOpenSettings={openSettings} />
      </div>
    </div>
  )
}
