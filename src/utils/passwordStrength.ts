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

