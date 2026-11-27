import i18n from '../i18n'

const NOTIFICATION_TAG = 'pumopokus-round-end'
const DEFAULT_ICON = '/pwa-192x192.png'

export function getNotificationPermission() {
  if (typeof window === 'undefined') return 'unsupported'
  if (typeof window.Notification === 'undefined') return 'unsupported'
  if (window.isSecureContext === false) return 'unsupported'
  return window.Notification.permission
}

export function shouldNotify({ enabled, visibility }) {
  return Boolean(enabled) && visibility === 'hidden'
}

export async function requestNotificationPermission() {
  const permission = getNotificationPermission()
  if (permission !== 'default') return permission

  try {
    return await window.Notification.requestPermission()
  } catch {
    return 'denied'
  }
}

async function getServiceWorkerRegistration() {
  if (typeof navigator === 'undefined') return null
  if (typeof navigator.serviceWorker?.getRegistration !== 'function') return null

  try {
    return await navigator.serviceWorker.getRegistration()
  } catch {
    return null
  }
}

function buildMessage(completedMode, nextMode) {
  return {
    title: i18n.t('notifications.roundEnd.title', {
      mode: i18n.t(`modes.${completedMode}`),
    }),
    options: {
      body: i18n.t('notifications.roundEnd.body', {
        next: i18n.t(`modes.${nextMode}`),
      }),
      tag: NOTIFICATION_TAG,
      icon: DEFAULT_ICON,
      badge: DEFAULT_ICON,
      lang: i18n.language,
    },
  }
}

export async function showRoundEndNotification({
  completedMode,
  nextMode,
  enabled = true,
  visibility = 'hidden',
}) {
  if (!shouldNotify({ enabled, visibility })) return false
  if (getNotificationPermission() !== 'granted') return false

  const { title, options } = buildMessage(completedMode, nextMode)

  try {
    const registration = await getServiceWorkerRegistration()
    if (typeof registration?.showNotification === 'function') {
      await registration.showNotification(title, options)
      return true
    }
  } catch {
    // Fall back to the page-level API below.
  }

  try {
    const notification = new window.Notification(title, options)
    notification.onclick = () => {
      window.focus()
      notification.close()
    }
    return true
  } catch {
    return false
  }
}
