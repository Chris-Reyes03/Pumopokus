import { getAudioContext } from './audioContext'

export async function primeChime() {
  const context = getAudioContext()
  if (!context || context.state !== 'suspended') return
  try {
    await context.resume()
  } catch {
    return
  }
}

export async function playChime(volume = 0.6) {
  if (!Number.isFinite(volume) || volume <= 0) return

  const context = getAudioContext()
  if (!context) return

  try {
    if (context.state === 'suspended') await context.resume()
  } catch {
    return
  }

  const start = context.currentTime + 0.02
  const notes = [
    { frequency: 659.25, at: 0 },
    { frequency: 880, at: 0.16 },
  ]

  for (const note of notes) {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const noteStart = start + note.at

    oscillator.type = 'sine'
    oscillator.frequency.value = note.frequency
    gain.gain.setValueAtTime(0.0001, noteStart)
    gain.gain.linearRampToValueAtTime(0.16 * volume, noteStart + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.55)

    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(noteStart)
    oscillator.stop(noteStart + 0.6)
  }
}
