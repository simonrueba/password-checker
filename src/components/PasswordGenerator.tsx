import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Copy, RefreshCw, Check } from 'lucide-react'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import RandomSourceSelector, { type RandomSource } from './RandomSourceSelector'
import { useToast } from "@/components/ui/use-toast"

interface PasswordGeneratorProps {
  onSelect?: (password: string) => void
}

const ADJECTIVES = ['happy', 'brave', 'swift', 'quiet', 'wise', 'bold', 'calm', 'kind']
const NOUNS = ['tiger', 'river', 'cloud', 'star', 'eagle', 'moon', 'tree', 'wave']
const NUMBERS = ['123', '456', '789', '234', '567', '890', '345', '678']
const SYMBOLS = ['!@#', '@#$', '#$%', '$%^', '%^&', '^&*', '&*(', '*()']

const RECIPE_TOKENS: Record<string, string> = {
  'A': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  'a': 'abcdefghijklmnopqrstuvwxyz',
  '0': '0123456789',
  '#': '!@#$%^&*',
  'W': 'HAPPY|BRAVE|SWIFT|QUIET|WISE|BOLD|CALM|KIND|QUICK|BRIGHT|STRONG|FREE|PURE|NOBLE',
  'w': 'tiger|river|cloud|star|eagle|moon|tree|wave|mountain|ocean|forest|storm|crystal|phoenix',
  'C': 'RED|BLUE|GREEN|GOLD|SILVER|BLACK|WHITE|PURPLE',
  'c': 'red|blue|green|gold|silver|black|white|purple',
  'Y': '2024|2025|2026|2027|2028',
  'M': '01|02|03|04|05|06|07|08|09|10|11|12',
  'D': '01|02|03|04|05|06|07|08|09|10|15|20|25|30'
} as const

function getSecureRandom(): number {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  return array[0] / (0xffffffff + 1)
}

function getRandomChoice<T>(array: T[], source: RandomSource): T {
  const random = source === 'math' ? Math.random() : getSecureRandom()
  return array[Math.floor(random * array.length)]
}

function generateMemorablePassword(source: RandomSource): string {
  const adjective = getRandomChoice(ADJECTIVES, source)
  const noun = getRandomChoice(NOUNS, source)
  const number = getRandomChoice(NUMBERS, source)
  const symbol = getRandomChoice(SYMBOLS, source)

  return `${adjective.charAt(0).toUpperCase() + adjective.slice(1)}${noun.charAt(0).toUpperCase() + noun.slice(1)}${number}${symbol}`
}

function generateFromRecipe(recipe: string, source: RandomSource): string {
  let result = ''
  for (const char of recipe) {
    const token = RECIPE_TOKENS[char as keyof typeof RECIPE_TOKENS]
    if (token) {
      if (token.includes('|')) {
        result += getRandomChoice(token.split('|'), source)
      } else {
        result += getRandomChoice(token.split(''), source)
      }
    } else {
      result += char
    }
  }
  return result
}

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
  if (options.type === 'memorable') return generateMemorablePassword(options.randomSource)
  if (options.type === 'recipe') return generateFromRecipe(options.recipe, options.randomSource)

  const { length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, randomSource } = options

  let chars = ''
  if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz'
  if (includeNumbers) chars += '0123456789'
  if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'
  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz'

  let password = ''
  for (let i = 0; i < length; i++) {
    password += getRandomChoice(chars.split(''), randomSource)
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

  useEffect(() => {
    const newPassword = generatePassword(options)
    setPassword(newPassword)
    if (onSelect) onSelect(newPassword)
  }, [options, onSelect])

  const handleGenerate = () => {
    const newPassword = generatePassword(options)
    setPassword(newPassword)
    setCopied(false)
    if (onSelect) onSelect(newPassword)
  }

  const handleCopy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast({ description: "Password copied to clipboard" })
    setTimeout(() => setCopied(false), 2000)
  }, [toast])

  return (
    <div className="space-y-8">
      {/* Generated Password */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <button
            onClick={() => handleCopy(password)}
            className="flex-1 text-left p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors font-mono text-sm break-all"
          >
            {password}
          </button>
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="icon" onClick={() => handleCopy(password)}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={handleGenerate}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Click password to copy</p>
      </div>

      {/* Password Type */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Type</Label>
        <RadioGroup
          value={options.type}
          onValueChange={(value: 'random' | 'memorable' | 'recipe') => setOptions(prev => ({ ...prev, type: value }))}
          className="flex gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="random" id="random" />
            <Label htmlFor="random" className="text-sm font-normal">Random</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="memorable" id="memorable" />
            <Label htmlFor="memorable" className="text-sm font-normal">Memorable</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="recipe" id="recipe" />
            <Label htmlFor="recipe" className="text-sm font-normal">Recipe</Label>
          </div>
        </RadioGroup>
      </div>

      {options.type === 'random' && (
        <>
          {/* Length */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label className="text-sm font-medium">Length</Label>
              <span className="text-sm text-muted-foreground">{options.length}</span>
            </div>
            <Slider
              value={[options.length]}
              onValueChange={([value]) => setOptions(prev => ({ ...prev, length: value }))}
              min={4}
              max={64}
              step={1}
            />
          </div>

          {/* Character Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Characters</Label>
            <div className="grid gap-3">
              {[
                { key: 'includeUppercase', label: 'Uppercase (A-Z)' },
                { key: 'includeLowercase', label: 'Lowercase (a-z)' },
                { key: 'includeNumbers', label: 'Numbers (0-9)' },
                { key: 'includeSymbols', label: 'Symbols (!@#$...)' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <Label className="text-sm font-normal">{label}</Label>
                  <Switch
                    checked={options[key as keyof PasswordOptions] as boolean}
                    onCheckedChange={(checked) => setOptions(prev => ({ ...prev, [key]: checked }))}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {options.type === 'memorable' && (
        <p className="text-sm text-muted-foreground">
          Creates passwords like <code className="bg-muted px-1 rounded">BraveEagle123!@#</code> -
          easier to remember but still secure.
        </p>
      )}

      {options.type === 'recipe' && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Recipe</Label>
          <Input
            value={options.recipe}
            onChange={(e) => setOptions(prev => ({ ...prev, recipe: e.target.value }))}
            placeholder="Ww00##"
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground">
            Tokens: A=uppercase, a=lowercase, 0=number, #=symbol, W/w=word, C/c=color
          </p>
        </div>
      )}

      {/* Random Source */}
      <RandomSourceSelector
        value={options.randomSource}
        onChange={(source) => setOptions(prev => ({ ...prev, randomSource: source }))}
      />
    </div>
  )
}
