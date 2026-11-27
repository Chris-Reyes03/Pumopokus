import { describe, expect, it } from 'vitest'
import i18n from './index'
import en from './en.json'
import fil from './fil.json'

function shape(value) {
  if (Array.isArray(value)) return value.map(shape)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, shape(value[key])]),
    )
  }
  return typeof value
}

function emptyValues(value, path = '') {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => emptyValues(item, `${path}[${index}]`))
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) =>
      emptyValues(child, path ? `${path}.${key}` : key),
    )
  }
  return typeof value === 'string' && value.trim() === '' ? [path] : []
}

describe('translations', () => {
  it('keeps English and Filipino keys in sync', () => {
    expect(shape(fil)).toEqual(shape(en))
  })

  it('has no empty strings', () => {
    expect(emptyValues(en)).toEqual([])
    expect(emptyValues(fil)).toEqual([])
  })

  it('interpolates Filipino counts that use the one category', async () => {
    await i18n.changeLanguage('fil')
    expect(i18n.t('reports.exam.days', { count: 5 })).toBe('5 araw na lang')
    expect(i18n.t('reports.exam.days', { count: 1 })).toBe('1 araw na lang')
    expect(i18n.t('reports.week.total', { count: 5, minutes: 140 })).toBe('140 min sa 5 session')
    await i18n.changeLanguage('en')
  })
})
