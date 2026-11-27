export function createId(prefix = 'id') {
  const crypto = globalThis.crypto
  if (crypto?.randomUUID) return crypto.randomUUID()
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}
