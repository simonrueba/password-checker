/**
 * Calculates the similarity between two passwords using various metrics
 */
export function calculateSimilarity(password1: string, password2: string): number {
  const metrics: number[] = []
  
  // Length similarity
  const lengthSimilarity = 1 - Math.abs(password1.length - password2.length) / Math.max(password1.length, password2.length)
  metrics.push(lengthSimilarity)

  // Character type similarity
  const getCharTypes = (str: string) => {
    return {
      lowercase: (str.match(/[a-z]/g) || []).length,
      uppercase: (str.match(/[A-Z]/g) || []).length,
      numbers: (str.match(/[0-9]/g) || []).length,
      special: (str.match(/[^a-zA-Z0-9]/g) || []).length
    }
  }
  
  const types1 = getCharTypes(password1)
  const types2 = getCharTypes(password2)
  
  const typeSimilarity = 1 - (
    Math.abs(types1.lowercase - types2.lowercase) +
    Math.abs(types1.uppercase - types2.uppercase) +
    Math.abs(types1.numbers - types2.numbers) +
    Math.abs(types1.special - types2.special)
  ) / Math.max(password1.length, password2.length)
  
  metrics.push(typeSimilarity)

  // Common substring similarity
  function longestCommonSubstring(str1: string, str2: string): number {
    const m = str1.length
    const n = str2.length
    const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0))
    let maxLength = 0
    
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1
          maxLength = Math.max(maxLength, dp[i][j])
        }
      }
    }
    
    return maxLength / Math.max(m, n)
  }
  
  metrics.push(longestCommonSubstring(password1, password2))

  // Pattern similarity (check for common patterns like number sequences)
  function getPatterns(str: string): string[] {
    const patterns: string[] = []
    // Number sequences
    const numberSeqs = str.match(/\d{2,}/g) || []
    patterns.push(...numberSeqs)
    // Letter sequences
    const letterSeqs = str.match(/[a-zA-Z]{2,}/g) || []
    patterns.push(...letterSeqs)
    return patterns
  }
  
  const patterns1 = getPatterns(password1)
  const patterns2 = getPatterns(password2)
  
  const patternSimilarity = patterns1.some(p1 => 
    patterns2.some(p2 => p1 === p2 || p1.includes(p2) || p2.includes(p1))
  ) ? 1 : 0
  
  metrics.push(patternSimilarity)

  // Calculate final similarity score (weighted average)
  const weights = [0.2, 0.3, 0.3, 0.2] // Adjust weights based on importance
  return metrics.reduce((acc, metric, i) => acc + metric * weights[i], 0)
} 