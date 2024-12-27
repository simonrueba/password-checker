import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Copy, RefreshCw, AlertTriangle, Check } from 'lucide-react'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Shield, Key, Hash, Type, Braces } from 'lucide-react'
import { Input } from "@/components/ui/input"
import RandomSourceSelector, { type RandomSource } from './RandomSourceSelector'
import { useToast } from "@/components/ui/use-toast"

interface PasswordGeneratorProps {
  onSelect?: (password: string) => void
}

// Word lists for memorable passwords
const ADJECTIVES = ['happy', 'brave', 'swift', 'quiet', 'wise', 'bold', 'calm', 'kind']
const NOUNS = ['tiger', 'river', 'cloud', 'star', 'eagle', 'moon', 'tree', 'wave']
const NUMBERS = ['123', '456', '789', '234', '567', '890', '345', '678']
const SYMBOLS = ['!@#', '@#$', '#$%', '$%^', '%^&', '^&*', '&*(', '*()']

const RECIPE_TOKENS: Record<string, string> = {
  // Basic characters
  'A': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  'a': 'abcdefghijklmnopqrstuvwxyz',
  '0': '0123456789',
  '#': '!@#$%^&*',
  
  // Common words
  'W': 'HAPPY|BRAVE|SWIFT|QUIET|WISE|BOLD|CALM|KIND|QUICK|BRIGHT|STRONG|FREE|PURE|NOBLE',
  'w': 'tiger|river|cloud|star|eagle|moon|tree|wave|mountain|ocean|forest|storm|crystal|phoenix',
  
  // Colors
  'C': 'RED|BLUE|GREEN|GOLD|SILVER|BLACK|WHITE|PURPLE',
  'c': 'red|blue|green|gold|silver|black|white|purple',
  
  // Years and dates
  'Y': '2024|2025|2026|2027|2028',
  'M': '01|02|03|04|05|06|07|08|09|10|11|12',
  'D': '01|02|03|04|05|06|07|08|09|10|15|20|25|30'
} as const

function getSecureRandom(): number {
  // Generate a random 32-bit number using the crypto API
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  // Convert to a number between 0 and 1
  return array[0] / (0xffffffff + 1)
}

function getMathRandom(): number {
  return Math.random()
}

// Add more random source implementations
function getSystemRandom(): number {
  // Use system-specific entropy sources when available
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1)
    window.crypto.getRandomValues(array)
    return array[0] / (0xffffffff + 1)
  }
  // Fallback to Node.js crypto if available
  if (typeof require !== 'undefined') {
    try {
      const crypto = require('crypto')
      const bytes = crypto.randomBytes(4)
      const value = bytes.readUInt32LE(0)
      return value / (0xffffffff + 1)
    } catch (e) {
      console.warn('System random source not available, falling back to Web Crypto API')
      return getSecureRandom()
    }
  }
  return getSecureRandom()
}

function getBrowserRandom(): number {
  // Use browser-specific sources of randomness
  let values = new Uint32Array(1)
  
  // Try different browser-specific random sources
  if (typeof window !== 'undefined') {
    // Performance timing as an additional entropy source
    const timing = performance.now() * 1000
    values[0] = timing >>> 0
    
    // Mouse movement and other browser events can add entropy
    document.addEventListener('mousemove', (e) => {
      values[0] = (values[0] + e.clientX + e.clientY) >>> 0
    }, { once: true })
  }
  
  // Mix with crypto random
  crypto.getRandomValues(values)
  return values[0] / (0xffffffff + 1)
}

// Update the random choice function
function getRandomChoice<T>(array: T[], source: RandomSource): T {
  let random: number
  switch (source) {
    case 'crypto':
      random = getSecureRandom()
      break
    case 'system-random':
      random = getSystemRandom()
      break
    case 'browser-random':
      random = getBrowserRandom()
      break
    case 'math':
      random = getMathRandom()
      break
    default:
      random = getSecureRandom() // Default to most secure option
  }
  return array[Math.floor(random * array.length)]
}

function generateMemorablePassword(source: RandomSource): string {
  const adjective = getRandomChoice(ADJECTIVES, source)
  const noun = getRandomChoice(NOUNS, source)
  const number = getRandomChoice(NUMBERS, source)
  const symbol = getRandomChoice(SYMBOLS, source)
  
  const capitalizedAdjective = adjective.charAt(0).toUpperCase() + adjective.slice(1)
  const capitalizedNoun = noun.charAt(0).toUpperCase() + noun.slice(1)
  
  return `${capitalizedAdjective}${capitalizedNoun}${number}${symbol}`
}

function generateFromRecipe(recipe: string, source: RandomSource): string {
  let result = ''
  for (const char of recipe) {
    const token = RECIPE_TOKENS[char as keyof typeof RECIPE_TOKENS]
    if (token) {
      if (token.includes('|')) {
        const words = token.split('|')
        result += getRandomChoice(words, source)
      } else {
        const chars = token.split('')
        result += getRandomChoice(chars, source)
      }
    } else {
      result += char
    }
  }
  return result
}

// Update the options type in the component
interface PasswordOptions {
  type: 'random' | 'memorable' | 'recipe'
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  recipe: string
  randomSource: RandomSource
}

function generatePassword(options: PasswordOptions): string {
  if (options.type === 'memorable') {
    return generateMemorablePassword(options.randomSource)
  }
  if (options.type === 'recipe') {
    return generateFromRecipe(options.recipe, options.randomSource)
  }

  const { length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, randomSource } = options
  
  const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  }
  
  let chars = ''
  if (includeUppercase) chars += charSets.uppercase
  if (includeLowercase) chars += charSets.lowercase
  if (includeNumbers) chars += charSets.numbers
  if (includeSymbols) chars += charSets.symbols
  
  if (!chars) chars = charSets.lowercase
  
  const charsArray = chars.split('')
  let password = ''
  for (let i = 0; i < length; i++) {
    password += getRandomChoice(charsArray, randomSource)
  }
  
  return password
}

export default function PasswordGenerator({ onSelect }: PasswordGeneratorProps) {
  const { toast } = useToast()
  const [options, setOptions] = useState<PasswordOptions>({
    type: 'random',
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    recipe: 'Ww00##',
    randomSource: 'crypto'
  })

  const [password, setPassword] = useState(() => generatePassword(options))
  const [copied, setCopied] = useState(false)

  const handleGenerate = () => {
    const newPassword = generatePassword(options)
    setPassword(newPassword)
    setCopied(false)
    if (onSelect) onSelect(newPassword)
  }

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast({
      description: "Password copied to clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Generated Password */}
      <Card className="overflow-hidden">
        <div className="border-b bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold tracking-tight">Generated Password</h3>
              <p className="text-sm text-muted-foreground">Click the password to copy it</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <Card 
              className="flex-1 bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer border-primary/20" 
              onClick={() => handleCopy(password)}
            >
              <CardContent className="p-4">
                <code className="text-sm md:text-base font-mono break-all select-all">{password}</code>
              </CardContent>
            </Card>
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleCopy(password)} 
                className="shrink-0 hover:bg-muted"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span className="sr-only">Copy password</span>
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleGenerate} 
                className="shrink-0 hover:bg-muted"
                title="Generate new password"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="sr-only">Generate new password</span>
              </Button>
            </div>
          </div>
          {copied && (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Copied to clipboard
            </p>
          )}
        </div>
      </Card>

      {/* Random Source Card */}
      <RandomSourceSelector
        value={options.randomSource}
        onChange={(source) => {
          setOptions(prev => ({ ...prev, randomSource: source }))
          handleGenerate() // Generate new password when source changes
        }}
      />

      {/* Password Options */}
      <Card className="overflow-hidden">
        <div className="border-b bg-muted/50 p-4">
          <div className="space-y-1">
            <h3 className="font-semibold tracking-tight">Password Options</h3>
            <p className="text-sm text-muted-foreground">Customize your password generation</p>
          </div>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Password Type */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Password Type</Label>
            <RadioGroup
              value={options.type}
              onValueChange={(value: 'random' | 'memorable' | 'recipe') => {
                setOptions(prev => ({ ...prev, type: value }))
                if (value === 'memorable') {
                  setOptions(prev => ({ ...prev, length: 16 }))
                }
              }}
              className="grid grid-cols-3 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="random" id="random" />
                <Label htmlFor="random" className="text-sm">Random</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="memorable" id="memorable" />
                <Label htmlFor="memorable" className="text-sm">Memorable</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="recipe" id="recipe" />
                <Label htmlFor="recipe" className="text-sm">Custom Recipe</Label>
              </div>
            </RadioGroup>
            <p className="text-xs text-muted-foreground">
              {options.type === 'memorable' 
                ? "Creates passwords using patterns that are easier to remember but still secure" 
                : "Generates completely random passwords for maximum security"}
            </p>
          </div>

          {options.type === 'random' ? (
            <>
              {/* Length */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Length</Label>
                    <span className="text-sm text-muted-foreground">{options.length} characters</span>
                  </div>
                  <Slider
                    value={[options.length]}
                    onValueChange={([value]) => setOptions(prev => ({ ...prev, length: value }))}
                    min={8}
                    max={32}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Longer passwords provide better security</p>
                </div>
              </div>

              {/* Character Options */}
              <div className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Uppercase Letters</Label>
                      <p className="text-xs text-muted-foreground">Include A-Z</p>
                    </div>
                    <Switch
                      checked={options.includeUppercase}
                      onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeUppercase: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Lowercase Letters</Label>
                      <p className="text-xs text-muted-foreground">Include a-z</p>
                    </div>
                    <Switch
                      checked={options.includeLowercase}
                      onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeLowercase: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Numbers</Label>
                      <p className="text-xs text-muted-foreground">Include 0-9</p>
                    </div>
                    <Switch
                      checked={options.includeNumbers}
                      onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeNumbers: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Symbols</Label>
                      <p className="text-xs text-muted-foreground">Include !@#$%^&* and more</p>
                    </div>
                    <Switch
                      checked={options.includeSymbols}
                      onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeSymbols: checked }))}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : options.type === 'memorable' ? (
            <div className="rounded-lg border p-4">
              <h4 className="font-medium mb-2">Memorable Password Pattern</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Creates passwords following this pattern:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span>Capitalized adjective (e.g., Happy, Brave)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span>Capitalized noun (e.g., Tiger, Cloud)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span>Three numbers (e.g., 123, 456)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span>Three symbols (e.g., !@#, $%^)</span>
                </li>
              </ul>
              <p className="text-xs text-muted-foreground mt-3">
                Example: BraveEagle123!@#
              </p>
            </div>
          ) : options.type === 'recipe' ? (
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h4 className="font-medium mb-2">Password Recipe</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Create your own password pattern using these tokens:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium">Basic Characters</h5>
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-2 py-0.5 rounded min-w-[2rem] text-center">A</code>
                        <span className="text-sm">Uppercase letter (A-Z)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-2 py-0.5 rounded min-w-[2rem] text-center">a</code>
                        <span className="text-sm">Lowercase letter (a-z)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-2 py-0.5 rounded min-w-[2rem] text-center">0</code>
                        <span className="text-sm">Number (0-9)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-2 py-0.5 rounded min-w-[2rem] text-center">#</code>
                        <span className="text-sm">Symbol (!@#$%^&* etc)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium">Words & Names</h5>
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-2 py-0.5 rounded min-w-[2rem] text-center">W</code>
                        <span className="text-sm">Random word in CAPS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-2 py-0.5 rounded min-w-[2rem] text-center">w</code>
                        <span className="text-sm">Random word in lowercase</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-2 py-0.5 rounded min-w-[2rem] text-center">C</code>
                        <span className="text-sm">Color name in CAPS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-2 py-0.5 rounded min-w-[2rem] text-center">c</code>
                        <span className="text-sm">Color name in lowercase</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-sm font-medium">Dates & Numbers</h5>
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-2 py-0.5 rounded min-w-[2rem] text-center">Y</code>
                        <span className="text-sm">Random year (2024-2028)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-2 py-0.5 rounded min-w-[2rem] text-center">M</code>
                        <span className="text-sm">Random month (01-12)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-2 py-0.5 rounded min-w-[2rem] text-center">D</code>
                        <span className="text-sm">Random day (01-30)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-sm font-medium">Example Recipes</h5>
                    <div className="grid gap-2 text-sm text-muted-foreground">
                      <p><code className="bg-muted px-1.5 rounded">W-w-00##</code> → BRAVE-tiger-45!@</p>
                      <p><code className="bg-muted px-1.5 rounded">C#w#Y</code> → BLUE#wave#2025</p>
                      <p><code className="bg-muted px-1.5 rounded">AAAA-0000</code> → SWIFT-1234</p>
                      <p><code className="bg-muted px-1.5 rounded">D/M/Y</code> → 15/06/2024</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="recipe" className="text-sm font-medium">Your Recipe</Label>
                    <div className="text-xs text-muted-foreground">
                      (Try the examples above or create your own)
                    </div>
                  </div>
                  <Input
                    id="recipe"
                    value={options.recipe}
                    onChange={(e) => setOptions(prev => ({ ...prev, recipe: e.target.value }))}
                    placeholder="Example: W-w-00##"
                    className="font-mono text-base"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleGenerate}
                    className="w-full"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate with this recipe
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  )
}

