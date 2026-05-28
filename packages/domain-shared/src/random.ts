/**
 * Shared cryptographic randomness helpers for game-domain code.
 */

const getWebCrypto = (): Crypto => {
  const webCrypto = typeof globalThis !== 'undefined' ? globalThis.crypto : undefined

  if (webCrypto) {
    return webCrypto
  }

  throw new Error('Web Crypto API is unavailable')
}

export const secureRandomInt = (maxExclusive: number): number => {
  const upperBound = Math.floor(maxExclusive)
  if (upperBound <= 0) {
    return 0
  }

  const crypto = getWebCrypto()
  const values = new Uint32Array(1)
  const limit = Math.floor(0x100000000 / upperBound) * upperBound

  let value = 0
  do {
    crypto.getRandomValues(values)
    value = values[0]
  } while (value >= limit)

  return value % upperBound
}

export const secureShuffle = <T>(values: readonly T[]): T[] => {
  const shuffled = [...values]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = secureRandomInt(index + 1)
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }

  return shuffled
}