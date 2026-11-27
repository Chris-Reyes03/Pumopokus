import { create } from 'zustand'
import { AMBIENT_TRACKS } from '../constants/ambience'
import { LANGUAGE_OPTIONS, THEME_OPTIONS } from '../constants/config'
import { DEFAULT_DURATIONS, MODE_LIST } from '../constants/modes'
import { loadSettings, saveSettings } from '../services/storage'
import {
  clampInterval,
  clampMinutes,
  clampVolume,
  getDefaultSettings,
  pickSettings,
} from '../utils/settings'

const initialSettings = loadSettings()

export const useSettingsStore = create((set, get) => {
  const commit = (patch) => {
    set(patch)
    saveSettings(pickSettings(get()))
  }

  return {
    ...initialSettings,
    setDuration: (mode, minutes) => {
      if (!MODE_LIST.includes(mode)) return
      commit({
        durations: {
          ...get().durations,
          [mode]: clampMinutes(minutes, DEFAULT_DURATIONS[mode]),
        },
      })
    },
    setLongBreakInterval: (interval) => {
      commit({ longBreakInterval: clampInterval(interval) })
    },
    setAutoStart: (key, enabled) => {
      if (key !== 'breaks' && key !== 'pomodoros') return
      commit({ autoStart: { ...get().autoStart, [key]: Boolean(enabled) } })
    },
    setLanguage: (language) => {
      if (!LANGUAGE_OPTIONS.includes(language)) return
      commit({ language })
    },
    setTheme: (theme) => {
      if (!THEME_OPTIONS.includes(theme)) return
      commit({ theme })
    },
    setChimeVolume: (volume) => {
      commit({ soundVolumes: { ...get().soundVolumes, chime: clampVolume(volume) } })
    },
    setAmbientVolume: (track, volume) => {
      if (!AMBIENT_TRACKS.includes(track)) return
      commit({ ambientVolumes: { ...get().ambientVolumes, [track]: clampVolume(volume) } })
    },
    setLightDataMode: (enabled) => {
      commit({ lightDataMode: Boolean(enabled) })
    },
    setNotificationsEnabled: (enabled) => {
      commit({ notificationsEnabled: Boolean(enabled) })
    },
    resetSettings: () => {
      const defaults = { ...getDefaultSettings(), language: get().language }
      set(defaults)
      saveSettings(pickSettings(defaults))
    },
  }
})
