import { createHash } from 'crypto'

export interface BreachResult {
  isBreached: boolean
  occurrences: number
}

export async function checkPasswordBreach(password: string): Promise<BreachResult> {
  // Create SHA-1 hash of the password
  const hash = createHash('sha1').update(password).digest('hex').toUpperCase()
  
  // Get the first 5 characters of the hash (prefix)
  const prefix = hash.slice(0, 5)
  const suffix = hash.slice(5)
  
  try {
    // Query the HIBP API with the hash prefix
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: {
        'Add-Padding': 'true', // Helps prevent timing attacks
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to check password breach status')
    }
    
    const text = await response.text()
    const hashes = text.split('\n')
    
    // Look for our hash suffix in the response
    for (const hash of hashes) {
      const [hashSuffix, count] = hash.split(':')
      if (hashSuffix.trim() === suffix) {
        return {
          isBreached: true,
          occurrences: parseInt(count.trim(), 10)
        }
      }
    }
    
    // Password not found in breaches
    return {
      isBreached: false,
      occurrences: 0
    }
  } catch (error) {
    console.error('Error checking password breach:', error)
    // Return null or error state if the check fails
    return {
      isBreached: false,
      occurrences: 0
    }
  }
} 