import zxcvbn from 'zxcvbn'

export interface StrengthResult {
  score: number
  entropy: number
  guessTimeString: string
  strengthText: string
  feedback: {
    warning: string
    suggestions: string[]
  }
  charTypes: {
    lowercase: number
    uppercase: number
    numbers: number
    symbols: number
  }
  patterns: string[]
}

export function checkPasswordStrength(password: string): StrengthResult {
  const result = zxcvbn(password)
  
  const strengthTexts = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong']
  
  const charTypes = {
    lowercase: (password.match(/[a-z]/g) || []).length,
    uppercase: (password.match(/[A-Z]/g) || []).length,
    numbers: (password.match(/[0-9]/g) || []).length,
    symbols: (password.match(/[^a-zA-Z0-9]/g) || []).length,
  }

  const patterns = []
  if (/(.)\1{2,}/.test(password)) patterns.push('Repeated characters')
  if (/^[a-zA-Z]+$/.test(password)) patterns.push('Only letters')
  if (/^[0-9]+$/.test(password)) patterns.push('Only numbers')
  if (/12345|qwerty|password/i.test(password)) patterns.push('Common password pattern')

  return {
    score: result.score,
    entropy: result.guesses_log10 * Math.log(2),
    guessTimeString: result.crack_times_display.offline_slow_hashing_1e4_per_second,
    strengthText: strengthTexts[result.score],
    feedback: result.feedback,
    charTypes,
    patterns,
  }
}

export interface SimilarityCheck {
  isSimilar: boolean
  similarTo: string
  reason: string
}

const commonSubstitutions: Record<string, string[]> = {
  'a': ['@', '4'],
  'e': ['3'],
  'i': ['1', '!'],
  'o': ['0'],
  's': ['$', '5'],
  't': ['7'],
  'l': ['1'],
  'b': ['8'],
  'g': ['9'],
  'z': ['2']
}

function generateVariations(word: string): string[] {
  const variations: string[] = [word]
  
  // Common number suffixes
  variations.push(...['1', '12', '123', '1234'].map(num => word + num))
  
  // Common year suffixes
  const currentYear = new Date().getFullYear()
  for (let year = currentYear; year >= currentYear - 10; year--) {
    variations.push(word + year)
  }
  
  // Common character substitutions
  let substitutedWord = word
  for (const [letter, substitutes] of Object.entries(commonSubstitutions)) {
    if (word.includes(letter)) {
      for (const substitute of substitutes) {
        substitutedWord = substitutedWord.replace(new RegExp(letter, 'g'), substitute)
        variations.push(substitutedWord)
      }
    }
  }
  
  return variations
}

export function checkPasswordSimilarity(password: string, commonPasswords: string[]): SimilarityCheck {
  const lowercasePassword = password.toLowerCase()
  
  for (const commonPassword of commonPasswords) {
    const variations = generateVariations(commonPassword)
    
    for (const variation of variations) {
      if (lowercasePassword === variation.toLowerCase()) {
        return {
          isSimilar: true,
          similarTo: commonPassword,
          reason: 'Exact match with common password variation'
        }
      }
      
      // Check if the password contains the variation
      if (lowercasePassword.includes(variation.toLowerCase())) {
        return {
          isSimilar: true,
          similarTo: commonPassword,
          reason: 'Contains a common password pattern'
        }
      }
      
      // Check Levenshtein distance for similar passwords
      if (levenshteinDistance(lowercasePassword, variation.toLowerCase()) <= 2) {
        return {
          isSimilar: true,
          similarTo: commonPassword,
          reason: 'Very similar to a common password'
        }
      }
    }
  }
  
  return {
    isSimilar: false,
    similarTo: '',
    reason: ''
  }
}

// Levenshtein distance calculation for finding similar strings
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null))

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + substitutionCost // substitution
      )
    }
  }

  return matrix[b.length][a.length]
}

