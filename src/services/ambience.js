import { AMBIENT_MAX_GAIN, AMBIENT_TRACKS } from '../constants/ambience'
import { getAudioContext } from './audioContext'

let activeNodes = null
let activeVolumes = {}
let noiseBuffers = null
let playing = false
const listeners = new Set()

function setPlaying(next) {
  if (playing === next) return
  playing = next
  listeners.forEach((listener) => listener())
}

export function subscribeAmbience(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getAmbienceSnapshot() {
  return playing
}

function clampVolume(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return 0
  return Math.min(1, Math.max(0, number))
}

function normalizeVolumes(volumes = {}) {
  return Object.fromEntries(AMBIENT_TRACKS.map((track) => [track, clampVolume(volumes?.[track])]))
}

function createNoiseBuffer(context, kind) {
  const length = Math.round(context.sampleRate * 4)
  const fade = Math.round(context.sampleRate * 0.1)
  const data = new Float32Array(length + fade)

  if (kind === 'brown') {
    let last = 0
    for (let index = 0; index < data.length; index += 1) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02
      data[index] = last * 3.5
    }
  } else {
    for (let index = 0; index < data.length; index += 1) {
      data[index] = Math.random() * 2 - 1
    }
  }

  for (let index = 0; index < fade; index += 1) {
    const mix = index / fade
    data[index] = data[index] * mix + data[length + index] * (1 - mix)
  }

  const buffer = context.createBuffer(1, length, context.sampleRate)
  buffer.getChannelData(0).set(data.subarray(0, length))
  return buffer
}

function buildTrack(context, track, buffers) {
  const gain = context.createGain()
  gain.gain.value = 0
  gain.connect(context.destination)

  const sources = []
  const oscillators = []

  if (track === 'rain') {
    const source = context.createBufferSource()
    source.buffer = buffers.white
    source.loop = true

    const high = context.createBiquadFilter()
    high.type = 'highpass'
    high.frequency.value = 800

    const low = context.createBiquadFilter()
    low.type = 'lowpass'
    low.frequency.value = 8000

    source.connect(high)
    high.connect(low)
    low.connect(gain)
    source.start()
    sources.push(source)
  } else if (track === 'ocean') {
    const source = context.createBufferSource()
    source.buffer = buffers.white
    source.loop = true

    const low = context.createBiquadFilter()
    low.type = 'lowpass'
    low.frequency.value = 520
    low.Q.value = 0.8

    const swell = context.createGain()
    swell.gain.value = 0.7

    source.connect(low)
    low.connect(swell)
    swell.connect(gain)
    source.start()
    sources.push(source)

    const filterLfo = context.createOscillator()
    filterLfo.type = 'sine'
    filterLfo.frequency.value = 0.07
    const filterDepth = context.createGain()
    filterDepth.gain.value = 240
    filterLfo.connect(filterDepth)
    filterDepth.connect(low.frequency)
    filterLfo.start()

    const swellLfo = context.createOscillator()
    swellLfo.type = 'sine'
    swellLfo.frequency.value = 0.05
    const swellDepth = context.createGain()
    swellDepth.gain.value = 0.3
    swellLfo.connect(swellDepth)
    swellDepth.connect(swell.gain)
    swellLfo.start()

    oscillators.push(filterLfo, swellLfo)
  } else {
    const source = context.createBufferSource()
    source.buffer = buffers.brown
    source.loop = true

    const low = context.createBiquadFilter()
    low.type = 'lowpass'
    low.frequency.value = 350

    source.connect(low)
    low.connect(gain)
    source.start()
    sources.push(source)
  }

  return { gain, sources, oscillators }
}

function hasAudibleVolume() {
  return AMBIENT_TRACKS.some((track) => activeVolumes[track] > 0)
}

function applyVolumes() {
  if (!activeNodes) return
  const context = getAudioContext()
  if (!context) return
  const now = context.currentTime

  for (const track of AMBIENT_TRACKS) {
    const node = activeNodes[track]
    if (!node) continue
    node.gain.gain.setTargetAtTime(activeVolumes[track] * AMBIENT_MAX_GAIN, now, 0.08)
  }
}

function stopNodes(nodes) {
  for (const node of Object.values(nodes)) {
    node.sources.forEach((source) => {
      try {
        source.stop()
      } catch {
        /* already stopped */
      }
    })
    node.oscillators.forEach((oscillator) => {
      try {
        oscillator.stop()
      } catch {
        /* already stopped */
      }
    })
    node.gain.disconnect()
  }
}

export function setAmbienceVolumes(volumes) {
  activeVolumes = normalizeVolumes(volumes)
  applyVolumes()
}

export async function startAmbience(volumes) {
  activeVolumes = normalizeVolumes(volumes)
  if (!hasAudibleVolume()) {
    setPlaying(false)
    return false
  }

  const context = getAudioContext()
  if (!context) {
    setPlaying(false)
    return false
  }

  try {
    if (context.state === 'suspended') await context.resume()
  } catch {
    setPlaying(false)
    return false
  }

  if (!noiseBuffers) {
    noiseBuffers = {
      white: createNoiseBuffer(context, 'white'),
      brown: createNoiseBuffer(context, 'brown'),
    }
  }

  if (!activeNodes) {
    activeNodes = Object.fromEntries(
      AMBIENT_TRACKS.map((track) => [track, buildTrack(context, track, noiseBuffers)]),
    )
  }

  applyVolumes()
  setPlaying(true)
  return true
}

export function stopAmbience() {
  setPlaying(false)
  if (!activeNodes) return
  const nodes = activeNodes
  activeNodes = null

  const context = getAudioContext()
  if (!context) {
    stopNodes(nodes)
    return
  }

  const now = context.currentTime
  for (const node of Object.values(nodes)) {
    node.gain.gain.setTargetAtTime(0.0001, now, 0.05)
  }
  globalThis.setTimeout(() => stopNodes(nodes), 250)
}
