import { useEffect, useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'
import { AMBIENT_TRACKS } from '../constants/ambience'
import {
  getAmbienceSnapshot,
  setAmbienceVolumes,
  startAmbience,
  stopAmbience,
  subscribeAmbience,
} from '../services/ambience'
import { useSettingsStore } from '../store/settingsStore'
import { PauseIcon, PlayIcon } from './icons'
import Button from './ui/Button'

export default function AmbientMixer() {
  const { t } = useTranslation()
  const volumes = useSettingsStore((state) => state.ambientVolumes)
  const lightDataMode = useSettingsStore((state) => state.lightDataMode)
  const setAmbientVolume = useSettingsStore((state) => state.setAmbientVolume)
  const playing = useSyncExternalStore(subscribeAmbience, getAmbienceSnapshot, () => false)

  const audible = AMBIENT_TRACKS.some((track) => volumes[track] > 0)

  useEffect(() => {
    setAmbienceVolumes(volumes)
  }, [volumes])

  useEffect(() => {
    if (lightDataMode) stopAmbience()
  }, [lightDataMode])

  useEffect(() => {
    if (playing && !audible) stopAmbience()
  }, [audible, playing])

  useEffect(() => () => stopAmbience(), [])

  const handleToggle = () => {
    if (playing) {
      stopAmbience()
      return
    }
    startAmbience(volumes).catch(() => stopAmbience())
  }

  return (
    <section
      id="sounds"
      className="mx-auto w-full max-w-3xl scroll-mt-6 px-4 pt-12 sm:px-6 sm:pt-16"
    >
      <div className="rounded-card border border-paper-line bg-paper-raised p-4 shadow-card sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight">{t('ambient.title')}</h2>
            <p className="mt-1 max-w-prose text-sm text-on-paper-muted">{t('ambient.subtitle')}</p>
          </div>
          <Button
            variant="paperGhost"
            size="sm"
            onClick={handleToggle}
            disabled={lightDataMode || !audible}
            className="shrink-0"
          >
            {playing ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4" />}
            {playing ? t('ambient.pause') : t('ambient.play')}
          </Button>
        </div>

        {lightDataMode ? (
          <p className="mt-4 rounded-control bg-tomato-soft px-3 py-2 text-xs text-on-paper-muted">
            {t('ambient.lightDataNotice')}
          </p>
        ) : null}

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {AMBIENT_TRACKS.map((track) => (
            <div key={track} className="min-w-0 rounded-2xl border border-paper-line bg-paper p-3">
              <div className="flex items-baseline justify-between gap-2">
                <label htmlFor={`ambient-${track}`} className="text-sm font-medium">
                  {t(`ambient.${track}`)}
                </label>
                <span className="text-right text-xs tabular-nums text-on-paper-muted">
                  {volumes[track] <= 0
                    ? t('ambient.muted')
                    : `${Math.round(volumes[track] * 100)}%`}
                </span>
              </div>
              <input
                id={`ambient-${track}`}
                type="range"
                min="0"
                max="100"
                step="5"
                value={Math.round(volumes[track] * 100)}
                onChange={(event) => setAmbientVolume(track, Number(event.target.value) / 100)}
                disabled={lightDataMode}
                aria-label={t('ambient.volume', { name: t(`ambient.${track}`) })}
                className="mt-3 w-full accent-tomato"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
