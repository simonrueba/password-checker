import { useEffect, useState } from 'react'
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, Hash, Type, Braces, Info, ChevronDown, ChevronUp } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { checkPasswordBreach, type BreachResult } from '@/utils/passwordBreach'
import { Button } from "@/components/ui/button"

interface SecurityAnalysisProps {
  password: string
}

// NIST Special Publication 800-63B guidelines
const ENTROPY_PER_CHAR = {
  uppercase: Math.log2(26),    // ~4.7 bits (26 possible chars)
  lowercase: Math.log2(26),    // ~4.7 bits (26 possible chars)
  numbers: Math.log2(10),      // ~3.32 bits (10 possible chars)
  symbols: Math.log2(33),      // ~5.04 bits (33 common symbols)
  keyboard_pattern: -4,        // Penalty for keyboard patterns
  sequential: -3,              // Penalty for sequential chars
  repeated: -2                 // Penalty for repeated chars
}

// Common password patterns to penalize
const COMMON_PATTERNS = [
  // Keyboard patterns
  /qwert/i, /asdf/i, /zxcv/i,
  // Repeated characters
  /(.)\1{2,}/,
  // Sequential numbers
  /(?:012|123|234|345|456|567|678|789)/,
  // Sequential letters
  /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i,
  // Common substitutions
  /[a@][s$][s$]/i, /[o0][o0][o0]/i
]

// Common password bases to penalize
const COMMON_BASES = [
  'password', 'letmein', 'admin', 'welcome', 'monkey', 'dragon', 'master', 
  'football', 'baseball', 'qwerty', '123456', 'abc123'
]

function calculateEntropy(password: string): {
  entropy: number,
  details: {
    baseEntropy: number,
    lengthBonus: number,
    uniquenessBonus: number,
    patternPenalty: number,
    effectiveLength: number,
    bitsPerChar: number,
    complexityScore: number
  }
} {
  // Base entropy calculation
  const charTypes = {
    uppercase: new Set(password.match(/[A-Z]/g) || []),
    lowercase: new Set(password.match(/[a-z]/g) || []),
    numbers: new Set(password.match(/[0-9]/g) || []),
    symbols: new Set(password.match(/[^A-Za-z0-9]/g) || [])
  }

  // Calculate base entropy from character set sizes
  let baseEntropy = 0
  baseEntropy += charTypes.uppercase.size * ENTROPY_PER_CHAR.uppercase
  baseEntropy += charTypes.lowercase.size * ENTROPY_PER_CHAR.lowercase
  baseEntropy += charTypes.numbers.size * ENTROPY_PER_CHAR.numbers
  baseEntropy += charTypes.symbols.size * ENTROPY_PER_CHAR.symbols

  // Length bonus (diminishing returns after 12 characters)
  const lengthBonus = password.length <= 12 
    ? password.length * 2 
    : 24 + (password.length - 12)

  // Uniqueness bonus
  const uniqueChars = new Set(password).size
  const uniquenessRatio = uniqueChars / password.length
  const uniquenessBonus = uniquenessRatio * 10

  // Pattern penalties
  let patternPenalty = 0

  // Keyboard patterns (qwerty, asdf)
  if (/qwert|asdf|zxcv/i.test(password)) {
    patternPenalty += Math.abs(ENTROPY_PER_CHAR.keyboard_pattern) * 2
  }

  // Sequential characters
  if (/(?:abc|bcd|cde|def|012|123|234|345)/i.test(password)) {
    patternPenalty += Math.abs(ENTROPY_PER_CHAR.sequential) * 2
  }

  // Repeated characters
  if (/(.)\1{2,}/.test(password)) {
    patternPenalty += Math.abs(ENTROPY_PER_CHAR.repeated) * 2
  }

  // Calculate effective length (accounting for patterns)
  const effectiveLength = Math.max(
    password.length * (1 - (patternPenalty / (baseEntropy + lengthBonus))),
    password.length * 0.5 // Never reduce below 50%
  )

  // Calculate complexity score based on character type variety
  const usedTypes = Object.values(charTypes).filter(set => set.size > 0).length
  const complexityScore = (usedTypes / 4) * 100 // 4 is max number of char types

  // Calculate bits per character
  const totalEntropy = Math.max(0, baseEntropy + lengthBonus + uniquenessBonus - patternPenalty)
  const bitsPerChar = totalEntropy / password.length

  return {
    entropy: totalEntropy,
    details: {
      baseEntropy,
      lengthBonus,
      uniquenessBonus,
      patternPenalty,
      effectiveLength,
      bitsPerChar,
      complexityScore
    }
  }
}

function calculateCrackTime(entropy: number, password: string): {
  time: number,
  unit: string,
  description: string
} {
  // For single characters, calculate combinations directly from character set
  let possibleCombinations: number;
  if (password.length === 1) {
    const char = password[0];
    if (/[A-Z]/.test(char)) possibleCombinations = 26;
    else if (/[a-z]/.test(char)) possibleCombinations = 26;
    else if (/[0-9]/.test(char)) possibleCombinations = 10;
    else possibleCombinations = 33; // symbols
  } else {
    possibleCombinations = Math.pow(2, entropy);
  }

  // Assuming 10 billion guesses per second (modern hardware)
  const guessesPerSecond = 10000000000;
  const seconds = possibleCombinations / (guessesPerSecond * 2); // Average case is half the possibilities

  if (seconds < 1) {
    return { time: seconds * 1000, unit: 'milliseconds', description: 'Instant' };
  }
  if (seconds < 60) {
    return { time: seconds, unit: 'seconds', description: 'Seconds' }
  }
  if (seconds < 3600) {
    return { time: seconds / 60, unit: 'minutes', description: 'Minutes' }
  }
  if (seconds < 86400) {
    return { time: seconds / 3600, unit: 'hours', description: 'Hours' }
  }
  if (seconds < 2592000) {
    return { time: seconds / 86400, unit: 'days', description: 'Days' }
  }
  if (seconds < 31536000) {
    return { time: seconds / 2592000, unit: 'months', description: 'Months' }
  }
  if (seconds < 315360000) {
    return { time: seconds / 31536000, unit: 'years', description: 'Years' }
  }
  return { 
    time: seconds / 31536000, 
    unit: 'years',
    description: 'Centuries+'
  }
}

function getStrengthLabel(entropy: number): {
  label: string
  color: string
  progressColor: string
  description: string
} {
  if (entropy < 28) {
    return {
      label: 'Very Weak',
      color: 'bg-red-500',
      progressColor: 'bg-red-500',
      description: 'This password can be cracked almost instantly'
    }
  }
  if (entropy < 36) {
    return {
      label: 'Weak',
      color: 'bg-orange-500',
      progressColor: 'bg-orange-500',
      description: 'This password offers minimal protection'
    }
  }
  if (entropy < 60) {
    return {
      label: 'Moderate',
      color: 'bg-yellow-500',
      progressColor: 'bg-yellow-500',
      description: 'This password provides basic protection'
    }
  }
  if (entropy < 128) {
    return {
      label: 'Strong',
      color: 'bg-green-500',
      progressColor: 'bg-green-500',
      description: 'This password offers good protection'
    }
  }
  return {
    label: 'Very Strong',
    color: 'bg-blue-500',
    progressColor: 'bg-blue-500',
    description: 'This password provides excellent protection'
  }
}

// Add this helper function to format large numbers
function formatLargeNumber(num: number): string {
  if (num < 1000) return num.toString()
  
  const units = ['', 'K', 'M', 'B', 'T', 'Q']
  const order = Math.floor(Math.log10(num) / 3)
  const unit = units[Math.min(order, units.length - 1)]
  const value = num / Math.pow(10, order * 3)
  
  return value.toFixed(1) + unit
}

export default function SecurityAnalysis({ password }: SecurityAnalysisProps) {
  const [breachResult, setBreachResult] = useState<BreachResult | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [activeTab, setActiveTab] = useState("factors")
  const [isExpanded, setIsExpanded] = useState(false)

  // Check for breaches when password changes
  useEffect(() => {
    let isMounted = true
    
    const checkBreach = async () => {
      if (!password) {
        setBreachResult(null)
        return
      }
      
      setIsChecking(true)
      try {
        const result = await checkPasswordBreach(password)
        if (isMounted) {
          setBreachResult(result)
        }
      } catch (error) {
        console.error('Failed to check password breach:', error)
      } finally {
        if (isMounted) {
          setIsChecking(false)
        }
      }
    }
    
    // Add a small delay to avoid too many API calls while typing
    const timeoutId = setTimeout(checkBreach, 800)
    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [password])

  const { entropy, details } = calculateEntropy(password)
  const strength = getStrengthLabel(entropy)
  const crackTime = calculateCrackTime(entropy, password)
  
  // Calculate character composition
  const composition = {
    length: password.length,
    uppercase: (password.match(/[A-Z]/g) || []),
    lowercase: (password.match(/[a-z]/g) || []),
    numbers: (password.match(/[0-9]/g) || []),
    symbols: (password.match(/[^A-Za-z0-9]/g) || []),
    unique: new Set(password).size
  }

  // Identify patterns
  const patterns = COMMON_PATTERNS.filter(pattern => pattern.test(password))
  const hasCommonBase = COMMON_BASES.some(base => 
    password.toLowerCase().includes(base)
  )

  // Prepare chart data
  const strengthFactors = [
    {
      name: "Base Entropy",
      value: Math.min(100, (details.baseEntropy / 50) * 100),
    },
    {
      name: "Length",
      value: Math.min(100, (details.lengthBonus / 24) * 100),
    },
    {
      name: "Uniqueness",
      value: (details.uniquenessBonus / 10) * 100,
    },
  ]

  const characterTypes = [
    {
      name: "Lowercase",
      value: composition.lowercase.length,
    },
    {
      name: "Numbers",
      value: composition.numbers.length,
    },
    {
      name: "Uppercase",
      value: composition.uppercase.length,
    },
    {
      name: "Symbols",
      value: composition.symbols.length,
    },
  ].filter(type => type.value > 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Security Analysis</h3>
          <p className="text-sm text-muted-foreground">Detailed password strength assessment</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4" />
              <span>Collapse</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              <span>Expand</span>
            </>
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-8">
          {/* Overall Strength */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Overall Strength</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  {Math.round(entropy)} bits
                </Badge>
                <Badge className={strength.color}>
                  {strength.label}
                </Badge>
              </div>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/20">
              <div
                className={`h-full transition-all ${strength.progressColor}`}
                style={{ width: `${(entropy / 128) * 100}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">{strength.description}</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-6 gap-2 bg-transparent">
              <TabsTrigger 
                value="factors" 
                className="bg-background hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm px-4 py-3 rounded-lg font-medium transition-all"
              >
                <div className="flex items-center justify-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Analysis</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="calculation" 
                className="bg-background hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm px-4 py-3 rounded-lg font-medium transition-all"
              >
                <div className="flex items-center justify-center gap-2">
                  <Hash className="h-4 w-4" />
                  <span>Calculation</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="details" 
                className="bg-background hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm px-4 py-3 rounded-lg font-medium transition-all"
              >
                <div className="flex items-center justify-center gap-2">
                  <Braces className="h-4 w-4" />
                  <span>Details</span>
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent 
              value="factors" 
              className="mt-6 space-y-8 relative data-[state=inactive]:opacity-50 transition-opacity"
            >
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Strength Factors Chart */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium">Strength Factors</h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs max-w-[200px]">
                            Shows how different factors contribute to your password's overall strength:
                            base entropy (character variety), length bonus, and uniqueness.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={strengthFactors}>
                        <XAxis
                          dataKey="name"
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value: number) => `${value}%`}
                        />
                        <Bar
                          dataKey="value"
                          fill="hsl(var(--primary))"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Character Distribution Chart */}
                {characterTypes.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium">Character Distribution</h4>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-[200px]">
                              Shows the distribution of different character types in your password.
                              A good password uses a mix of different character types.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={characterTypes}>
                          <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value: number) => `${value}`}
                          />
                          <Bar
                            dataKey="value"
                            fill="hsl(var(--primary))"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>

              {/* Warnings */}
              {(patterns.length > 0 || hasCommonBase) && (
                <Card className="border-2 border-yellow-600 bg-yellow-600/15 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-yellow-800 dark:text-yellow-400">
                    <AlertTriangle className="h-4 w-4" />
                    Security Concerns
                  </div>
                  <ul className="mt-2 space-y-1">
                    {patterns.length > 0 && (
                      <li className="text-sm text-yellow-800/90 dark:text-yellow-300/90">
                        • Contains predictable patterns that reduce security
                      </li>
                    )}
                    {hasCommonBase && (
                      <li className="text-sm text-yellow-800/90 dark:text-yellow-300/90">
                        • Based on a commonly used password
                      </li>
                    )}
                  </ul>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="calculation" className="mt-6">
              {/* Calculation Breakdown */}
              <div className="rounded-lg border p-6 space-y-6">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  How is this calculated?
                </h4>
                
                {/* Base Entropy */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h5 className="text-sm font-medium text-muted-foreground">Base Entropy</h5>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs max-w-[200px]">
                            Base entropy measures the randomness in your password based on the types
                            of characters used. Higher entropy means a stronger password.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="space-y-2 text-sm pl-4">
                    {composition.lowercase.length > 0 && (
                      <div className="flex justify-between">
                        <span>Lowercase ({composition.lowercase.join(", ")})</span>
                        <span className="font-mono">
                          {composition.lowercase.length} × {ENTROPY_PER_CHAR.lowercase.toFixed(2)} = {' '}
                          {(composition.lowercase.length * ENTROPY_PER_CHAR.lowercase).toFixed(2)} bits
                        </span>
                      </div>
                    )}
                    {composition.numbers.length > 0 && (
                      <div className="flex justify-between">
                        <span>Numbers ({composition.numbers.join(", ")})</span>
                        <span className="font-mono">
                          {composition.numbers.length} × {ENTROPY_PER_CHAR.numbers.toFixed(2)} = {' '}
                          {(composition.numbers.length * ENTROPY_PER_CHAR.numbers).toFixed(2)} bits
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>Base Entropy Total</span>
                      <span className="font-mono">{details.baseEntropy.toFixed(2)} bits</span>
                    </div>
                  </div>
                </div>

                {/* Bonuses */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-muted-foreground">2. Bonuses</h5>
                  <div className="space-y-1 text-sm pl-4">
                    <div className="flex justify-between">
                      <span>Length ({password.length} characters)</span>
                      <span className="font-mono">+{details.lengthBonus.toFixed(2)} bits</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uniqueness ({composition.unique} unique of {password.length})</span>
                      <span className="font-mono">+{details.uniquenessBonus.toFixed(2)} bits</span>
                    </div>
                    <div className="flex justify-between font-medium pt-1 border-t">
                      <span>Total Bonuses</span>
                      <span className="font-mono">+{(details.lengthBonus + details.uniquenessBonus).toFixed(2)} bits</span>
                    </div>
                  </div>
                </div>

                {/* Penalties */}
                {details.patternPenalty > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-muted-foreground">3. Pattern Penalties</h5>
                    <div className="space-y-1 text-sm pl-4">
                      {/qwert|asdf|zxcv/i.test(password) && (
                        <div className="flex justify-between">
                          <span>Keyboard pattern detected</span>
                          <span className="font-mono text-red-600">-{Math.abs(ENTROPY_PER_CHAR.keyboard_pattern * 2)} bits</span>
                        </div>
                      )}
                      {/(?:abc|bcd|cde|def|012|123|234|345)/i.test(password) && (
                        <div className="flex justify-between">
                          <span>Sequential characters detected</span>
                          <span className="font-mono text-red-600">-{Math.abs(ENTROPY_PER_CHAR.sequential * 2)} bits</span>
                        </div>
                      )}
                      <div className="flex justify-between font-medium pt-1 border-t text-red-600">
                        <span>Total Penalties</span>
                        <span className="font-mono">-{details.patternPenalty.toFixed(2)} bits</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Final Score */}
                <div className="pt-2 border-t">
                  <div className="flex justify-between font-medium">
                    <span>Final Entropy Score</span>
                    <span className="font-mono">{entropy.toFixed(2)} bits</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Base ({details.baseEntropy.toFixed(1)}) + Bonuses ({(details.lengthBonus + details.uniquenessBonus).toFixed(1)}) 
                    {details.patternPenalty > 0 ? ` - Penalties (${details.patternPenalty.toFixed(1)})` : ""}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6 mt-6">
              {/* Detailed Metrics */}
              <div className="grid gap-4 rounded-lg border p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Base Entropy</p>
                    <p className="text-2xl font-bold tracking-tight">
                      {Math.round(details.baseEntropy)} bits
                    </p>
                    <p className="text-xs text-muted-foreground">
                      From character set variety
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">Bits per Character</p>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-[200px]">
                              Measures how much randomness each character adds to your password.
                              Higher values indicate more efficient password strength per character.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-2xl font-bold tracking-tight">
                      {details.bitsPerChar.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Entropy density
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Complexity</span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(details.complexityScore)}%
                    </span>
                  </div>
                  <Progress value={details.complexityScore} className="h-1.5" />
                  <p className="text-xs text-muted-foreground">
                    Based on character type variety
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Effective Length</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-[200px]">
                              The actual strength of your password length after considering patterns
                              and repetitions. Patterns reduce the effective length.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {details.effectiveLength.toFixed(1)} chars
                    </span>
                  </div>
                  <Progress 
                    value={(details.effectiveLength / password.length) * 100} 
                    className="h-1.5" 
                  />
                  <p className="text-xs text-muted-foreground">
                    After pattern penalties
                  </p>
                </div>

                {details.patternPenalty > 0 && (
                  <div className="rounded-lg border-2 border-yellow-600 bg-yellow-600/15 p-2 text-sm text-yellow-800/90 dark:text-yellow-300/90">
                    Pattern penalties: -{Math.round(details.patternPenalty)} bits
                  </div>
                )}
              </div>

              {/* Crack Time Estimation */}
              <div className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Estimated Crack Time</h4>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          Assuming 10 billion guesses per second (modern hardware)
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-lg sm:text-2xl font-bold tracking-tight break-all">
                      {formatLargeNumber(crackTime.time)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {crackTime.unit}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg sm:text-2xl font-bold tracking-tight break-all">
                      {formatLargeNumber(Math.pow(2, entropy))}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      combinations
                    </p>
                  </div>
                </div>
              </div>

              {/* Character Composition */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Character Composition</h4>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Length</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{composition.length} characters</span>
                      <Badge variant="outline" className={composition.length >= 12 ? 'bg-green-500/10' : 'bg-yellow-500/10'}>
                        {composition.length >= 12 ? 'Good' : 'Short'}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Type className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Character Types</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {[
                          composition.uppercase.length > 0,
                          composition.lowercase.length > 0,
                          composition.numbers.length > 0,
                          composition.symbols.length > 0
                        ].filter(Boolean).length} of 4
                      </span>
                      <Badge 
                        variant="outline" 
                        className={composition.uppercase.length > 0 && 
                                  composition.lowercase.length > 0 && 
                                  composition.numbers.length > 0 && 
                                  composition.symbols.length > 0 
                          ? 'bg-green-500/10' 
                          : 'bg-yellow-500/10'}
                      >
                        {composition.uppercase.length > 0 && 
                         composition.lowercase.length > 0 && 
                         composition.numbers.length > 0 && 
                         composition.symbols.length > 0 
                          ? 'Complete' 
                          : 'Incomplete'}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Braces className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Unique Characters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {composition.unique} of {composition.length}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={composition.unique / composition.length >= 0.7 
                          ? 'bg-green-500/10' 
                          : 'bg-yellow-500/10'}
                      >
                        {composition.unique / composition.length >= 0.7 
                          ? 'Good Variety' 
                          : 'Limited Variety'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Strength Comparison */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  Strength Comparison
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Common Word (e.g., "password")</span>
                    <Progress value={20} className="w-32 h-1.5" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Numbers Only (e.g., "123456")</span>
                    <Progress value={10} className="w-32 h-1.5" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Word + Numbers (e.g., "password123")</span>
                    <Progress value={30} className="w-32 h-1.5" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Your Password</span>
                    <Progress 
                      value={(entropy / 128) * 100} 
                      className="w-32 h-1.5"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Add breach warning if found */}
          {breachResult?.isBreached && (
            <Card className="border-2 border-red-600 bg-red-600/15 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-red-800 dark:text-red-400">
                <AlertTriangle className="h-4 w-4" />
                Password Breach Warning
              </div>
              <p className="mt-2 text-sm text-red-800/90 dark:text-red-300/90">
                This password has been found in {breachResult.occurrences.toLocaleString()} data breaches. 
                It is strongly recommended to choose a different password.
              </p>
            </Card>
          )}

          {/* Add loading state while checking */}
          {isChecking && (
            <Card className="border bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                Checking password security...
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
} 