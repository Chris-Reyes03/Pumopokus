import { QUOTES } from '../data/quotes'

export function getRandomQuote(random = Math.random) {
  if (!QUOTES.length) return null
  const index = Math.min(QUOTES.length - 1, Math.max(0, Math.floor(random() * QUOTES.length)))
  return QUOTES[index]
}
