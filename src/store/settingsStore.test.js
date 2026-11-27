import { beforeEach, describe, expect, it } from 'vitest'
import { useSettingsStore } from './settingsStore'

describe('settingsStore notifications', () => {
  beforeEach(() => {
    localStorage.clear()
    useSettingsStore.getState().resetSettings()
  })

  it('persists the notifications toggle', () => {
    useSettingsStore.getState().setNotificationsEnabled(true)

    expect(useSettingsStore.getState().notificationsEnabled).toBe(true)
    expect(JSON.parse(localStorage.getItem('pumopokus.settings')).data.notificationsEnabled).toBe(
      true,
    )

    useSettingsStore.getState().setNotificationsEnabled(false)
    expect(JSON.parse(localStorage.getItem('pumopokus.settings')).data.notificationsEnabled).toBe(
      false,
    )
  })

  it('coerces the stored value to a boolean', () => {
    useSettingsStore.getState().setNotificationsEnabled('yes')
    expect(useSettingsStore.getState().notificationsEnabled).toBe(true)

    useSettingsStore.getState().setNotificationsEnabled(0)
    expect(useSettingsStore.getState().notificationsEnabled).toBe(false)
  })
})
