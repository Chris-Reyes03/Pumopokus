import { describe, expect, it } from 'vitest'
import { getAudioContext } from './audioContext'
import { setAmbienceVolumes, startAmbience, stopAmbience } from './ambience'

describe('ambience', () => {
  it('degrades gracefully without Web Audio support', async () => {
    expect(getAudioContext()).toBeNull()

    expect(() => setAmbienceVolumes({ rain: 1 })).not.toThrow()
    expect(() => stopAmbience()).not.toThrow()
    await expect(startAmbience({ rain: 1 })).resolves.toBe(false)
  })
})
