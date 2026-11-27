let audioContext = null

export function getAudioContext() {
  if (typeof window === 'undefined') return null
  const AudioContextClass = window.AudioContext ?? window.webkitAudioContext
  if (!AudioContextClass) return null
  if (!audioContext) audioContext = new AudioContextClass()
  return audioContext
}
