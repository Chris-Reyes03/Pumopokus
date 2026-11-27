import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { THEME_OPTIONS } from '../../constants/config'
import { MODES } from '../../constants/modes'
import {
  getNotificationPermission,
  requestNotificationPermission,
} from '../../services/notifications'
import { useSettingsStore } from '../../store/settingsStore'
import { useTimerStore } from '../../store/timerStore'
import {
  BellIcon,
  ClockIcon,
  CloseIcon,
  GlobeIcon,
  PaletteIcon,
  RepeatIcon,
  SproutIcon,
  VolumeIcon,
} from '../icons'
import Button from '../ui/Button'
import Segmented from '../ui/Segmented'
import DurationField from './DurationField'
import IntervalField from './IntervalField'
import SettingsSection from './SettingsSection'
import ToggleSwitch from './ToggleSwitch'

const LANGUAGE_LABELS = {
  en: 'language.english',
  fil: 'language.filipino',
}

export default function SettingsModal({ open, onClose }) {
  const { t } = useTranslation()
  const dialogRef = useRef(null)
  const titleId = useId()
  const descriptionId = useId()

  const durations = useSettingsStore((state) => state.durations)
  const longBreakInterval = useSettingsStore((state) => state.longBreakInterval)
  const autoStart = useSettingsStore((state) => state.autoStart)
  const theme = useSettingsStore((state) => state.theme)
  const language = useSettingsStore((state) => state.language)
  const chimeVolume = useSettingsStore((state) => state.soundVolumes.chime)
  const lightDataMode = useSettingsStore((state) => state.lightDataMode)
  const notificationsEnabled = useSettingsStore((state) => state.notificationsEnabled)
  const timerStatus = useTimerStore((state) => state.status)
  const [notificationsPending, setNotificationsPending] = useState(false)
  const [notificationError, setNotificationError] = useState(null)

  const setDuration = useSettingsStore((state) => state.setDuration)
  const setLongBreakInterval = useSettingsStore((state) => state.setLongBreakInterval)
  const setAutoStart = useSettingsStore((state) => state.setAutoStart)
  const setTheme = useSettingsStore((state) => state.setTheme)
  const setLanguage = useSettingsStore((state) => state.setLanguage)
  const setChimeVolume = useSettingsStore((state) => state.setChimeVolume)
  const setLightDataMode = useSettingsStore((state) => state.setLightDataMode)
  const setNotificationsEnabled = useSettingsStore((state) => state.setNotificationsEnabled)
  const resetSettings = useSettingsStore((state) => state.resetSettings)

  const themeOptions = THEME_OPTIONS.map((value) => ({ value, label: t(`theme.${value}`) }))
  const languageOptions = ['en', 'fil'].map((value) => ({
    value,
    label: t(LANGUAGE_LABELS[value]),
  }))

  const notificationPermission = getNotificationPermission()
  const notificationsUnsupported = notificationPermission === 'unsupported'
  let notificationNotice = null
  if (notificationError === 'default') {
    notificationNotice = t('settings.notifications.notGranted')
  } else if (notificationError === 'denied' || notificationsEnabled) {
    if (notificationPermission === 'denied')
      notificationNotice = t('settings.notifications.blocked')
  }
  if (notificationsUnsupported) notificationNotice = t('settings.notifications.unsupported')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      if (typeof dialog.showModal === 'function') {
        if (!dialog.open) dialog.showModal()
      } else {
        dialog.setAttribute('open', '')
      }
      return
    }

    if (!dialog.open) return
    if (typeof dialog.close === 'function') {
      dialog.close()
    } else {
      dialog.removeAttribute('open')
      dialog.dispatchEvent(new Event('close'))
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const previewChime = () => {
    import('../../services/chime')
      .then(({ playChime }) => playChime(chimeVolume))
      .catch(() => undefined)
  }

  const handleReset = () => {
    if (window.confirm(t('settings.reset.confirm'))) resetSettings()
  }

  const handleBackdropPointerDown = (event) => {
    if (event.target === event.currentTarget) onClose()
  }

  const handleNotificationsToggle = async (next) => {
    if (!next) {
      setNotificationError(null)
      setNotificationsEnabled(false)
      return
    }

    setNotificationsPending(true)
    setNotificationError(null)
    const permission = await requestNotificationPermission()
    setNotificationsPending(false)

    if (permission === 'granted') {
      setNotificationsEnabled(true)
      return
    }

    setNotificationsEnabled(false)
    setNotificationError(permission)
  }

  const handleCancel = (event) => {
    event.preventDefault()
    onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClose={onClose}
      onCancel={handleCancel}
      onPointerDown={handleBackdropPointerDown}
      className="m-auto w-[calc(100%-2rem)] max-w-lg overflow-hidden rounded-card bg-paper text-on-paper shadow-card"
    >
      <div className="paper-scope flex max-h-[88svh] flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-paper-line px-5 py-4 sm:px-6">
          <div>
            <h2 id={titleId} className="font-display text-2xl font-bold tracking-tight">
              {t('settings.title')}
            </h2>
            <p id={descriptionId} className="mt-1 text-sm text-on-paper-muted">
              {t('settings.subtitle')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('settings.close')}
            title={t('settings.close')}
            className="grid size-9 shrink-0 place-items-center rounded-full bg-on-paper/10 text-on-paper transition-colors duration-150 hover:bg-on-paper/15"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="overflow-y-auto overscroll-contain">
          {timerStatus !== 'idle' ? (
            <p className="mx-5 mt-4 rounded-xl bg-tomato-soft px-3 py-2 text-xs text-on-paper-muted sm:mx-6">
              {t('settings.runningNotice')}
            </p>
          ) : null}

          <div className="mt-3 divide-y divide-paper-line">
            <SettingsSection
              icon={<ClockIcon />}
              title={t('settings.durations.title')}
              description={t('settings.durations.description')}
            >
              {Object.values(MODES).map((mode) => (
                <DurationField
                  key={mode}
                  mode={mode}
                  label={t(`settings.durations.${mode}`)}
                  value={durations[mode]}
                  onChange={(minutes) => setDuration(mode, minutes)}
                />
              ))}
              <IntervalField value={longBreakInterval} onChange={setLongBreakInterval} />
            </SettingsSection>

            <SettingsSection
              icon={<RepeatIcon />}
              title={t('settings.autoStart.title')}
              description={t('settings.autoStart.description')}
            >
              <ToggleSwitch
                id="auto-start-breaks"
                label={t('settings.autoStart.breaks')}
                checked={autoStart.breaks}
                onChange={(value) => setAutoStart('breaks', value)}
              />
              <ToggleSwitch
                id="auto-start-pomodoros"
                label={t('settings.autoStart.pomodoros')}
                checked={autoStart.pomodoros}
                onChange={(value) => setAutoStart('pomodoros', value)}
              />
            </SettingsSection>

            <SettingsSection
              icon={<PaletteIcon />}
              title={t('settings.appearance.title')}
              description={t('settings.appearance.description')}
            >
              <p className="mb-2 text-sm font-medium">{t('settings.appearance.theme')}</p>
              <Segmented
                options={themeOptions}
                value={theme}
                onChange={setTheme}
                ariaLabel={t('settings.appearance.theme')}
                tone="paper"
              />
            </SettingsSection>

            <SettingsSection
              icon={<GlobeIcon />}
              title={t('settings.language.title')}
              description={t('settings.language.description')}
            >
              <Segmented
                options={languageOptions}
                value={language}
                onChange={setLanguage}
                ariaLabel={t('settings.language.title')}
                tone="paper"
              />
            </SettingsSection>

            <SettingsSection
              icon={<VolumeIcon />}
              title={t('settings.sound.title')}
              description={t('settings.sound.description')}
            >
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="chime-volume" className="text-sm font-medium">
                  {t('settings.sound.volume')}
                </label>
                <div className="flex items-center gap-2">
                  <span className="min-w-10 text-right text-xs tabular-nums text-on-paper-muted">
                    {chimeVolume <= 0
                      ? t('settings.sound.muted')
                      : `${Math.round(chimeVolume * 100)}%`}
                  </span>
                  <Button
                    variant="paperGhost"
                    size="sm"
                    onClick={previewChime}
                    disabled={chimeVolume <= 0}
                  >
                    {t('settings.sound.preview')}
                  </Button>
                </div>
              </div>
              <input
                id="chime-volume"
                type="range"
                min="0"
                max="100"
                step="5"
                value={Math.round(chimeVolume * 100)}
                onChange={(event) => setChimeVolume(Number(event.target.value) / 100)}
                className="mt-3 w-full accent-tomato"
              />
            </SettingsSection>

            <SettingsSection
              icon={<BellIcon />}
              title={t('settings.notifications.title')}
              description={t('settings.notifications.description')}
            >
              <ToggleSwitch
                id="round-notifications"
                label={t('settings.notifications.toggle')}
                checked={notificationsEnabled}
                onChange={handleNotificationsToggle}
                disabled={notificationsPending || notificationsUnsupported}
              />
              {notificationNotice ? (
                <p className="mt-1 rounded-control bg-tomato-soft px-3 py-2 text-xs text-on-paper-muted">
                  {notificationNotice}
                </p>
              ) : null}
            </SettingsSection>

            <SettingsSection
              icon={<SproutIcon />}
              title={t('settings.lightData.title')}
              description={t('settings.lightData.description')}
            >
              <ToggleSwitch
                id="light-data-mode"
                label={t('settings.lightData.toggle')}
                checked={lightDataMode}
                onChange={setLightDataMode}
              />
            </SettingsSection>
          </div>

          <div className="flex flex-col gap-3 border-t border-paper-line px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-xs leading-5 text-on-paper-muted">
              {t('settings.reset.description')}
            </p>
            <Button
              variant="paperOutline"
              size="md"
              onClick={handleReset}
              className="shrink-0 self-start sm:self-auto"
            >
              {t('settings.reset.action')}
            </Button>
          </div>
        </div>
      </div>
    </dialog>
  )
}
