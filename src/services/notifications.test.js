import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '../i18n'
import {
  getNotificationPermission,
  requestNotificationPermission,
  shouldNotify,
  showRoundEndNotification,
} from './notifications'

const originalNotification = Object.getOwnPropertyDescriptor(window, 'Notification')
const originalServiceWorker = Object.getOwnPropertyDescriptor(navigator, 'serviceWorker')

function setNotification(permission, requestPermission = vi.fn(async () => permission)) {
  class MockNotification {
    static permission = permission
    static requestPermission = requestPermission
    static instances = []

    constructor(title, options) {
      this.title = title
      this.options = options
      this.close = vi.fn()
      MockNotification.instances.push(this)
    }
  }

  Object.defineProperty(window, 'Notification', {
    configurable: true,
    value: MockNotification,
  })
  return MockNotification
}

function setServiceWorker(getRegistration) {
  Object.defineProperty(navigator, 'serviceWorker', {
    configurable: true,
    value: { getRegistration },
  })
}

beforeEach(async () => {
  Object.defineProperty(window, 'isSecureContext', { configurable: true, value: true })
  await i18n.changeLanguage('en')
})

afterEach(() => {
  if (originalNotification) {
    Object.defineProperty(window, 'Notification', originalNotification)
  } else {
    delete window.Notification
  }
  if (originalServiceWorker) {
    Object.defineProperty(navigator, 'serviceWorker', originalServiceWorker)
  } else {
    delete navigator.serviceWorker
  }
  vi.restoreAllMocks()
})

describe('notification permission', () => {
  it('reports unsupported without the Notification API', () => {
    delete window.Notification
    expect(getNotificationPermission()).toBe('unsupported')
  })

  it('returns the current permission without prompting', async () => {
    const request = vi.fn(async () => 'granted')
    setNotification('granted', request)

    await expect(requestNotificationPermission()).resolves.toBe('granted')
    expect(request).not.toHaveBeenCalled()
  })

  it('prompts only when permission is still default', async () => {
    const request = vi.fn(async () => 'granted')
    setNotification('default', request)

    await expect(requestNotificationPermission()).resolves.toBe('granted')
    expect(request).toHaveBeenCalledTimes(1)
  })

  it('does not prompt when permission was denied', async () => {
    const request = vi.fn(async () => 'granted')
    setNotification('denied', request)

    await expect(requestNotificationPermission()).resolves.toBe('denied')
    expect(request).not.toHaveBeenCalled()
  })
})

describe('shouldNotify', () => {
  it('requires the setting and a hidden tab', () => {
    expect(shouldNotify({ enabled: true, visibility: 'hidden' })).toBe(true)
    expect(shouldNotify({ enabled: false, visibility: 'hidden' })).toBe(false)
    expect(shouldNotify({ enabled: true, visibility: 'visible' })).toBe(false)
  })
})

describe('showRoundEndNotification', () => {
  it('skips when disabled, visible, or not granted', async () => {
    const MockNotification = setNotification('denied')
    const payload = { completedMode: 'pomodoro', nextMode: 'shortBreak' }

    expect(
      await showRoundEndNotification({ ...payload, enabled: false, visibility: 'hidden' }),
    ).toBe(false)
    expect(
      await showRoundEndNotification({ ...payload, enabled: true, visibility: 'visible' }),
    ).toBe(false)
    expect(
      await showRoundEndNotification({ ...payload, enabled: true, visibility: 'hidden' }),
    ).toBe(false)
    expect(MockNotification.instances).toHaveLength(0)
  })

  it('uses the service worker when one is available', async () => {
    setNotification('granted')
    const showNotification = vi.fn(async () => undefined)
    setServiceWorker(async () => ({ showNotification }))

    await expect(
      showRoundEndNotification({
        completedMode: 'pomodoro',
        nextMode: 'shortBreak',
        enabled: true,
        visibility: 'hidden',
      }),
    ).resolves.toBe(true)

    expect(showNotification).toHaveBeenCalledWith(
      'Pomodoro complete',
      expect.objectContaining({
        body: 'Your Short break is ready.',
        tag: 'pumopokus-round-end',
        icon: '/pwa-192x192.png',
      }),
    )
  })

  it('falls back to the page Notification when no service worker is available', async () => {
    const MockNotification = setNotification('granted')
    setServiceWorker(async () => undefined)

    await expect(
      showRoundEndNotification({
        completedMode: 'shortBreak',
        nextMode: 'pomodoro',
        enabled: true,
        visibility: 'hidden',
      }),
    ).resolves.toBe(true)

    expect(MockNotification.instances).toHaveLength(1)
    expect(MockNotification.instances[0].title).toBe('Short break complete')
  })

  it('uses the active language for the message', async () => {
    await i18n.changeLanguage('fil')
    setNotification('granted')
    const showNotification = vi.fn(async () => undefined)
    setServiceWorker(async () => ({ showNotification }))

    await showRoundEndNotification({
      completedMode: 'pomodoro',
      nextMode: 'longBreak',
      enabled: true,
      visibility: 'hidden',
    })

    expect(showNotification).toHaveBeenCalledWith(
      'Tapos na ang Pomodoro',
      expect.objectContaining({ body: 'Handa na ang Mahabang pahinga mo.' }),
    )
  })
})
