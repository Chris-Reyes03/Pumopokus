import { normalizeExam } from '../utils/reports'
import { normalizeSessions } from '../utils/sessions'
import { normalizeSettings } from '../utils/settings'
import { normalizeTaskState, pickTaskState } from '../utils/tasks'

export const STORAGE_SCHEMA_VERSION = 1
export const STORAGE_KEYS = {
  settings: 'pumopokus.settings',
  tasks: 'pumopokus.tasks',
  sessions: 'pumopokus.sessions',
  exam: 'pumopokus.exam',
}

function getStorage() {
  try {
    return globalThis.localStorage ?? null
  } catch {
    return null
  }
}

export function readVersioned(key) {
  const storage = getStorage()
  if (!storage) return null

  try {
    const raw = storage.getItem(key)
    if (!raw) return null
    const envelope = JSON.parse(raw)
    if (!envelope || typeof envelope !== 'object') return null
    if (envelope.schemaVersion !== STORAGE_SCHEMA_VERSION) return null
    return envelope.data ?? null
  } catch {
    return null
  }
}

export function writeVersioned(key, data) {
  const storage = getStorage()
  if (!storage) return false

  try {
    storage.setItem(
      key,
      JSON.stringify({
        schemaVersion: STORAGE_SCHEMA_VERSION,
        data,
        updatedAt: new Date().toISOString(),
      }),
    )
    return true
  } catch {
    return false
  }
}

export function loadSettings() {
  return normalizeSettings(readVersioned(STORAGE_KEYS.settings))
}

export function saveSettings(settings) {
  return writeVersioned(STORAGE_KEYS.settings, settings)
}

export function loadTaskState() {
  return normalizeTaskState(readVersioned(STORAGE_KEYS.tasks))
}

export function saveTaskState(state) {
  return writeVersioned(STORAGE_KEYS.tasks, pickTaskState(state))
}

export function loadSessions() {
  return normalizeSessions(readVersioned(STORAGE_KEYS.sessions))
}

export function saveSessions(sessions) {
  return writeVersioned(STORAGE_KEYS.sessions, { sessions })
}

export function loadExam() {
  return normalizeExam(readVersioned(STORAGE_KEYS.exam))
}

export function saveExam(exam) {
  return writeVersioned(STORAGE_KEYS.exam, normalizeExam(exam))
}
