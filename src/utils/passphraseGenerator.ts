import { uniqueNamesGenerator, adjectives, colors, animals, NumberDictionary } from 'unique-names-generator'

const customConfig = {
  dictionaries: [adjectives, colors, animals, NumberDictionary.generate({ min: 100, max: 999 })],
  separator: '-',
  length: 4,
  style: 'capital'
}

export interface PassphraseOptions {
  wordCount?: number
  includeCasing?: boolean
  includeNumbers?: boolean
  includeSymbols?: boolean
  separator?: string
}

const symbols = ['!', '@', '#', '$', '%', '^', '&', '*']

export function generatePassphrase(options: PassphraseOptions = {}): string {
  const {
    wordCount = 4,
    includeCasing = true,
    includeNumbers = true,
    includeSymbols = true,
    separator = '-'
  } = options

  const config = {
    ...customConfig,
    length: wordCount,
    separator,
    style: includeCasing ? 'capital' : 'lowerCase'
  }

  let passphrase = uniqueNamesGenerator(config)

  if (includeNumbers) {
    const randomNum = Math.floor(Math.random() * 900) + 100
    passphrase = `${passphrase}${separator}${randomNum}`
  }

  if (includeSymbols) {
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)]
    passphrase = `${passphrase}${separator}${randomSymbol}`
  }

  return passphrase
}

export function generateMultiplePhrases(count: number, options: PassphraseOptions = {}): string[] {
  return Array.from({ length: count }, () => generatePassphrase(options))
}

export function estimatePassphraseStrength(passphrase: string): {
  entropy: number
  strength: 'weak' | 'moderate' | 'strong' | 'very-strong'
} {
  const words = passphrase.split(/[-_\s]/)
  const hasNumbers = /\d/.test(passphrase)
  const hasSymbols = /[!@#$%^&*]/.test(passphrase)
  const hasMixedCase = /[a-z]/.test(passphrase) && /[A-Z]/.test(passphrase)

  // Calculate entropy based on dictionary sizes and additional character sets
  const wordEntropy = words.length * Math.log2(10000) // Assuming ~10k words per dictionary
  const numberEntropy = hasNumbers ? Math.log2(1000) : 0 // 3-digit numbers
  const symbolEntropy = hasSymbols ? Math.log2(symbols.length) : 0
  const caseEntropy = hasMixedCase ? words.length : 0

  const totalEntropy = wordEntropy + numberEntropy + symbolEntropy + caseEntropy

  // Determine strength based on entropy
  if (totalEntropy < 50) return { entropy: totalEntropy, strength: 'weak' }
  if (totalEntropy < 70) return { entropy: totalEntropy, strength: 'moderate' }
  if (totalEntropy < 90) return { entropy: totalEntropy, strength: 'strong' }
  return { entropy: totalEntropy, strength: 'very-strong' }
}

export function suggestPassphraseImprovements(passphrase: string): string[] {
  const suggestions: string[] = []
  const { strength } = estimatePassphraseStrength(passphrase)

  if (strength === 'weak' || strength === 'moderate') {
    if (!passphrase.includes('-')) {
      suggestions.push('Add separators between words (e.g., use hyphens)')
    }
    if (!/\d/.test(passphrase)) {
      suggestions.push('Add numbers to increase complexity')
    }
    if (!/[!@#$%^&*]/.test(passphrase)) {
      suggestions.push('Include special characters')
    }
    if (passphrase.split(/[-_\s]/).length < 4) {
      suggestions.push('Use at least 4 words for better security')
    }
  }

  return suggestions
} 