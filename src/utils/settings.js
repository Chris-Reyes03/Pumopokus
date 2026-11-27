import { AMBIENT_TRACKS, DEFAULT_AMBIENT_VOLUMES } from '../constants/ambience'
import {
  DEFAULT_CHIME_VOLUME,
  DEFAULT_LANGUAGE,
  LANGUAGE_OPTIONS,
  THEME_OPTIONS,
} from '../constants/config'
import {
  DEFAULT_DURATIONS,
  LONG_BREAK_INTERVAL,
  MAX_DURATION_MINUTES,
  MAX_LONG_BREAK_INTERVAL,
  MIN_DURATION_MINUTES,
  MIN_LONG_BREAK_INTERVAL,
  MODE_LIST,
} from '../constants/modes'

export function detectLanguage() {
  if (typeof navigator === 'undefined') return DEFAULT_LANGUAGE
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language]
  const prefersFilipino = languages.some(
    (language) => typeof language === 'string' && /^(fil|tl)\b/i.test(language),
  )
  return prefersFilipino ? 'fil' : DEFAULT_LANGUAGE
}

export function clampMinutes(value, fallback) {
  const number = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(number)) return fallback
  return Math.min(MAX_DURATION_MINUTES, Math.max(MIN_DURATION_MINUTES, Math.round(number)))
}

export function clampInterval(value, fallback = LONG_BREAK_INTERVAL) {
  const number = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(number)) return fallback
  return Math.min(MAX_LONG_BREAK_INTERVAL, Math.max(MIN_LONG_BREAK_INTERVAL, Math.round(number)))
}

export function clampVolume(value, fallback = DEFAULT_CHIME_VOLUME) {
  const number = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(number)) return fallback
  return Math.min(1, Math.max(0, number))
}

export function getDefaultSettings(language = detectLanguage()) {
  return {
    durations: { ...DEFAULT_DURATIONS },
    longBreakInterval: LONG_BREAK_INTERVAL,
    autoStart: { breaks: false, pomodoros: false },
    language: LANGUAGE_OPTIONS.includes(language) ? language : DEFAULT_LANGUAGE,
    theme: 'system',
    lightDataMode: false,
    soundVolumes: { chime: DEFAULT_CHIME_VOLUME },
    ambientVolumes: { ...DEFAULT_AMBIENT_VOLUMES },
    notificationsEnabled: false,
  }
}

export function normalizeSettings(raw) {
  const defaults = getDefaultSettings()
  if (!raw || typeof raw !== 'object') return defaults

  const rawDurations = raw.durations && typeof raw.durations === 'object' ? raw.durations : {}
  const rawAutoStart = raw.autoStart && typeof raw.autoStart === 'object' ? raw.autoStart : {}
  const rawSound = raw.soundVolumes && typeof raw.soundVolumes === 'object' ? raw.soundVolumes : {}
  const rawAmbient =
    raw.ambientVolumes && typeof raw.ambientVolumes === 'object' ? raw.ambientVolumes : {}

  return {
    durations: Object.fromEntries(
      MODE_LIST.map((mode) => [mode, clampMinutes(rawDurations[mode], defaults.durations[mode])]),
    ),
    longBreakInterval: clampInterval(raw.longBreakInterval, defaults.longBreakInterval),
    autoStart: {
      breaks:
        typeof rawAutoStart.breaks === 'boolean' ? rawAutoStart.breaks : defaults.autoStart.breaks,
      pomodoros:
        typeof rawAutoStart.pomodoros === 'boolean'
          ? rawAutoStart.pomodoros
          : defaults.autoStart.pomodoros,
    },
    language: LANGUAGE_OPTIONS.includes(raw.language) ? raw.language : defaults.language,
    theme: THEME_OPTIONS.includes(raw.theme) ? raw.theme : defaults.theme,
    lightDataMode:
      typeof raw.lightDataMode === 'boolean' ? raw.lightDataMode : defaults.lightDataMode,
    soundVolumes: { chime: clampVolume(rawSound.chime, defaults.soundVolumes.chime) },
    ambientVolumes: Object.fromEntries(
      AMBIENT_TRACKS.map((track) => [
        track,
        clampVolume(rawAmbient[track], defaults.ambientVolumes[track]),
      ]),
    ),
    notificationsEnabled:
      typeof raw.notificationsEnabled === 'boolean'
        ? raw.notificationsEnabled
        : defaults.notificationsEnabled,
  }
}

export function pickSettings(state) {
  return {
    durations: state.durations,
    longBreakInterval: state.longBreakInterval,
    autoStart: state.autoStart,
    language: state.language,
    theme: state.theme,
    lightDataMode: state.lightDataMode,
    soundVolumes: state.soundVolumes,
    ambientVolumes: state.ambientVolumes,
    notificationsEnabled: state.notificationsEnabled,
  }
}
