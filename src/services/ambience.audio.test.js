import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AMBIENT_MAX_GAIN } from '../constants/ambience'

const audio = vi.hoisted(() => ({ context: null }))

vi.mock('./audioContext', () => ({
  getAudioContext: () => audio.context,
}))

function createFakeContext({ state = 'running' } = {}) {
  const sources = []
  const oscillators = []
  const gains = []

  const context = {
    state,
    sampleRate: 8000,
    currentTime: 0,
    destination: {},
    resume: vi.fn(async () => {
      context.state = 'running'
    }),
    createBuffer: vi.fn((_channels, length) => ({
      getChannelData: () => new Float32Array(length),
    })),
    createGain: vi.fn(() => {
      const gain = {
        gain: { value: 0, setTargetAtTime: vi.fn() },
        connect: vi.fn(),
        disconnect: vi.fn(),
      }
      gains.push(gain)
      return gain
    }),
    createBufferSource: vi.fn(() => {
      const source = {
        buffer: null,
        loop: false,
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      }
      sources.push(source)
      return source
    }),
    createBiquadFilter: vi.fn(() => ({
      type: '',
      frequency: { value: 0 },
      Q: { value: 0 },
      connect: vi.fn(),
    })),
    createOscillator: vi.fn(() => {
      const oscillator = {
        type: '',
        frequency: { value: 0 },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      }
      oscillators.push(oscillator)
      return oscillator
    }),
  }

  return { context, sources, oscillators, gains }
}

function trackGains(gains) {
  return gains.filter((gain) => gain.gain.setTargetAtTime.mock.calls.length > 0)
}

let ambience

beforeEach(async () => {
  vi.resetModules()
  audio.context = null
  ambience = await import('./ambience')
})

afterEach(() => {
  vi.useRealTimers()
})

describe('ambience playback', () => {
  it('starts every track when a volume is audible', async () => {
    const { context, sources } = createFakeContext()
    audio.context = context

    await expect(ambience.startAmbience({ rain: 0.5 })).resolves.toBe(true)

    expect(ambience.getAmbienceSnapshot()).toBe(true)
    expect(sources).toHaveLength(3)
    for (const source of sources) expect(source.start).toHaveBeenCalledTimes(1)
  })

  it('does not start when every volume is zero', async () => {
    const { context, sources } = createFakeContext()
    audio.context = context

    await expect(ambience.startAmbience({ rain: 0, ocean: 0, brown: 0 })).resolves.toBe(false)

    expect(ambience.getAmbienceSnapshot()).toBe(false)
    expect(sources).toHaveLength(0)
  })

  it('clamps volumes and applies the shared max gain', async () => {
    const { context, gains } = createFakeContext()
    audio.context = context

    await ambience.startAmbience({ rain: 2, ocean: -1, brown: 0.5 })

    const targets = trackGains(gains).map((gain) => gain.gain.setTargetAtTime.mock.calls[0][0])
    expect(targets).toEqual([AMBIENT_MAX_GAIN, 0, 0.5 * AMBIENT_MAX_GAIN])
  })

  it('applies volume changes while playing', async () => {
    const { context, gains } = createFakeContext()
    audio.context = context

    await ambience.startAmbience({ rain: 0.2 })
    ambience.setAmbienceVolumes({ rain: 1 })

    expect(gains[0].gain.setTargetAtTime).toHaveBeenLastCalledWith(AMBIENT_MAX_GAIN, 0, 0.08)
  })

  it('resumes a suspended context', async () => {
    const { context } = createFakeContext({ state: 'suspended' })
    audio.context = context

    await expect(ambience.startAmbience({ rain: 0.5 })).resolves.toBe(true)

    expect(context.resume).toHaveBeenCalledTimes(1)
  })

  it('does not start when the context cannot resume', async () => {
    const { context } = createFakeContext({ state: 'suspended' })
    context.resume.mockRejectedValueOnce(new Error('blocked'))
    audio.context = context

    await expect(ambience.startAmbience({ rain: 0.5 })).resolves.toBe(false)
    expect(ambience.getAmbienceSnapshot()).toBe(false)
  })

  it('fades to silence and then stops the nodes', async () => {
    vi.useFakeTimers()
    const { context, gains, sources } = createFakeContext()
    audio.context = context

    await ambience.startAmbience({ rain: 0.5 })
    ambience.stopAmbience()

    const fading = trackGains(gains)
    expect(ambience.getAmbienceSnapshot()).toBe(false)
    expect(fading).toHaveLength(3)
    for (const gain of fading) {
      expect(gain.gain.setTargetAtTime).toHaveBeenLastCalledWith(0.0001, 0, 0.05)
    }
    expect(sources[0].stop).not.toHaveBeenCalled()

    vi.advanceTimersByTime(250)

    for (const source of sources) expect(source.stop).toHaveBeenCalledTimes(1)
    for (const gain of fading) expect(gain.disconnect).toHaveBeenCalledTimes(1)
  })
})
