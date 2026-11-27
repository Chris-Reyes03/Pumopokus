import { describe, expect, it } from 'vitest'
import { QUOTES } from '../data/quotes'
import { getRandomQuote } from './quotes'

describe('reward quotes', () => {
  it('has at least 30 bilingual entries with unique ids', () => {
    expect(QUOTES.length).toBeGreaterThanOrEqual(30)

    const ids = new Set(QUOTES.map((quote) => quote.id))
    expect(ids.size).toBe(QUOTES.length)

    for (const quote of QUOTES) {
      expect(quote.fil.trim()).not.toBe('')
      expect(quote.en.trim()).not.toBe('')
    }
  })

  it('picks a quote deterministically and stays in bounds', () => {
    expect(getRandomQuote(() => 0)).toBe(QUOTES[0])
    expect(getRandomQuote(() => 0.999999)).toBe(QUOTES[QUOTES.length - 1])
    expect(getRandomQuote(() => 1)).toBe(QUOTES[QUOTES.length - 1])
  })
})
