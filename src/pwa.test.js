// @vitest-environment node
import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const manifest = JSON.parse(
  readFileSync(new URL('../public/manifest.webmanifest', import.meta.url), 'utf8'),
)

describe('web app manifest', () => {
  it('has the fields needed to install', () => {
    expect(manifest.name).toBe('PUMOPOKUS')
    expect(manifest.start_url).toBe('/')
    expect(manifest.display).toBe('standalone')
    expect(manifest.theme_color).toBe('#c25542')
    expect(manifest.icons.some((icon) => icon.purpose === 'maskable')).toBe(true)
  })

  it('references icon files that exist', () => {
    for (const icon of manifest.icons) {
      expect(existsSync(new URL(`../public${icon.src}`, import.meta.url))).toBe(true)
    }
  })
})
