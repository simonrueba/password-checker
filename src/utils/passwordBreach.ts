export interface BreachResult {
  isBreached: boolean
  occurrences: number
}

async function sha1(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()
}

export async function checkPasswordBreach(password: string): Promise<BreachResult> {
  try {
    const hash = await sha1(password)
    const prefix = hash.slice(0, 5)
    const suffix = hash.slice(5)

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: {
        'Add-Padding': 'true',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to check password breach status')
    }

    const text = await response.text()
    const hashes = text.split('\n')

    for (const hashLine of hashes) {
      const [hashSuffix, count] = hashLine.split(':')
      if (hashSuffix.trim() === suffix) {
        return {
          isBreached: true,
          occurrences: parseInt(count.trim(), 10)
        }
      }
    }

    return {
      isBreached: false,
      occurrences: 0
    }
  } catch (error) {
    console.error('Error checking password breach:', error)
    return {
      isBreached: false,
      occurrences: 0
    }
  }
}
