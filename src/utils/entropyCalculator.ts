/**
 * Calculates the actual entropy of a password based on character set sizes and patterns
 */

const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
}

interface EntropyResult {
  entropy: number;
  possibleCombinations: number;
  effectiveLength: number;
  usedCharsets: string[];
  bitsPerCharacter: number;
}

export function calculateEntropy(password: string): EntropyResult {
  if (!password) {
    return {
      entropy: 0,
      possibleCombinations: 0,
      effectiveLength: 0,
      usedCharsets: [],
      bitsPerCharacter: 0
    }
  }

  // Determine which character sets are used
  const usedCharsets = Object.entries(CHAR_SETS).filter(([, charset]) =>
    [...password].some(char => charset.includes(char))
  ).map(([name]) => name)

  // Calculate the size of the effective character set
  const poolSize = usedCharsets.reduce((sum, charset) => 
    sum + CHAR_SETS[charset as keyof typeof CHAR_SETS].length, 0)

  // Adjust for common patterns and repetitions
  // Higher uniqueness ratio = better password (more unique chars relative to length)
  const uniqueChars = new Set(password).size
  const uniquenessRatio = uniqueChars / password.length

  // Detect sequential patterns
  const hasSequentialPattern = (str: string): boolean => {
    for (let i = 0; i < str.length - 2; i++) {
      const curr = str.charCodeAt(i)
      const next = str.charCodeAt(i + 1)
      const nextNext = str.charCodeAt(i + 2)
      if (next - curr === 1 && nextNext - next === 1) return true
    }
    return false
  }

  // Detect keyboard patterns (simplified)
  const hasKeyboardPattern = (str: string): boolean => {
    const commonPatterns = ['qwerty', 'asdfgh', 'zxcvbn']
    return commonPatterns.some(pattern => str.toLowerCase().includes(pattern))
  }

  // Calculate pattern penalties
  const patternPenalty = (
    (hasSequentialPattern(password) ? 0.8 : 1) *
    (hasKeyboardPattern(password) ? 0.8 : 1)
  )

  // Calculate effective password length considering patterns and repetitions
  // uniquenessRatio rewards passwords with more unique characters
  const effectiveLength = password.length * uniquenessRatio * patternPenalty

  // Calculate the actual entropy
  const bitsPerCharacter = Math.log2(poolSize)
  const entropy = bitsPerCharacter * effectiveLength

  // Calculate possible combinations
  const possibleCombinations = Math.pow(2, entropy)

  return {
    entropy: Math.round(entropy * 100) / 100,
    possibleCombinations,
    effectiveLength: Math.round(effectiveLength * 100) / 100,
    usedCharsets,
    bitsPerCharacter: Math.round(bitsPerCharacter * 100) / 100
  }
}

/**
 * Estimates the time to crack based on entropy and hardware capabilities
 */
export function estimateCrackTime(entropy: number) {
  // Hardware assumptions (guesses per second)
  const HARDWARE_SPEEDS = {
    onlineFast: 1000,        // 1k guesses/second
    onlineSlow: 100,         // 100 guesses/second
    offlineSlow: 1000000,    // 1M guesses/second
    offlineFast: 100000000,  // 100M guesses/second
    quantum: 1000000000000   // 1T guesses/second (theoretical quantum computer)
  }

  const combinations = Math.pow(2, entropy)
  const averageAttempts = combinations / 2 // On average, need to try half of all possibilities

  return {
    onlineFast: averageAttempts / HARDWARE_SPEEDS.onlineFast,
    onlineSlow: averageAttempts / HARDWARE_SPEEDS.onlineSlow,
    offlineSlow: averageAttempts / HARDWARE_SPEEDS.offlineSlow,
    offlineFast: averageAttempts / HARDWARE_SPEEDS.offlineFast,
    quantum: averageAttempts / HARDWARE_SPEEDS.quantum
  }
}

/**
 * Formats a time duration in seconds to a human-readable string
 */
export function formatDuration(seconds: number): string {
  if (seconds < 1) {
    return 'instantly'
  }
  if (seconds < 60) {
    return `${Math.round(seconds)} seconds`
  }
  if (seconds < 3600) {
    return `${Math.round(seconds / 60)} minutes`
  }
  if (seconds < 86400) {
    return `${Math.round(seconds / 3600)} hours`
  }
  if (seconds < 31536000) {
    return `${Math.round(seconds / 86400)} days`
  }
  if (seconds < 315360000) {
    return `${Math.round(seconds / 31536000)} years`
  }
  if (seconds < 3153600000) {
    return `${Math.round(seconds / 315360000)} decades`
  }
  return 'centuries'
} 