import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Copy, RefreshCw, Check } from 'lucide-react'
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import RandomSourceSelector, { type RandomSource } from './RandomSourceSelector'

interface PassphraseGeneratorProps {
  onSelect?: (passphrase: string) => void
}

interface PassphraseOptions {
  wordCount: number
  separator: string
  includeNumbers: boolean
  includeCasing: boolean
  includeSymbols: boolean
  randomSource: RandomSource
}

const ADJECTIVES = [
  'happy', 'brave', 'bright', 'calm', 'clever', 'eager', 'fair', 'gentle', 'kind', 'lively', 'proud', 'wise',
  'swift', 'bold', 'quick', 'sharp', 'strong', 'warm', 'wild', 'young', 'free', 'pure', 'rich', 'safe'
]

const NOUNS = [
  'tiger', 'river', 'mountain', 'forest', 'ocean', 'desert', 'island', 'garden', 'castle', 'valley', 'eagle', 'dragon',
  'crystal', 'diamond', 'emerald', 'falcon', 'harbor', 'jungle', 'knight', 'lotus', 'meteor', 'nebula', 'oasis', 'pearl'
]

const VERBS = [
  'jumps', 'flows', 'glows', 'flies', 'grows', 'leads', 'runs', 'sings', 'walks', 'swims', 'dances', 'shines',
  'soars', 'races', 'leaps', 'rides', 'glides', 'floats', 'climbs', 'dives', 'dreams', 'guards', 'rules', 'seeks'
]

function generatePassphrase(options: PassphraseOptions): string {
  const { wordCount, includeCasing, includeNumbers, includeSymbols, separator, randomSource } = options

  const getRandomItem = <T,>(array: T[]): T => {
    if (randomSource === 'math') {
      return array[Math.floor(Math.random() * array.length)]
    }
    const cryptoArray = new Uint32Array(1)
    crypto.getRandomValues(cryptoArray)
    return array[Math.floor((cryptoArray[0] / (0xffffffff + 1)) * array.length)]
  }

  const words: string[] = []
  const usedWords = new Set<string>()

  for (let i = 0; i < wordCount; i++) {
    const pattern = i % 3
    let word = ''

    switch (pattern) {
      case 0: word = getRandomItem(ADJECTIVES); break
      case 1: word = getRandomItem(NOUNS); break
      case 2: word = getRandomItem(VERBS); break
    }

    if (usedWords.has(word)) {
      word = getRandomItem([...ADJECTIVES, ...NOUNS, ...VERBS].filter(w => !usedWords.has(w)))
    }
    usedWords.add(word)

    const cryptoArray = new Uint32Array(3)
    crypto.getRandomValues(cryptoArray)

    if (includeCasing && (cryptoArray[0] / (0xffffffff + 1) > 0.5 || pattern === 1)) {
      word = word.charAt(0).toUpperCase() + word.slice(1)
    }

    if (includeNumbers && cryptoArray[1] / (0xffffffff + 1) > 0.7) {
      word += Math.floor((cryptoArray[1] / (0xffffffff + 1)) * 100)
    }

    if (includeSymbols && cryptoArray[2] / (0xffffffff + 1) > 0.7) {
      word += getRandomItem(['!', '@', '#', '$', '%', '&', '*'])
    }

    words.push(word)
  }

  return words.join(separator)
}

export default function PassphraseGenerator({ onSelect }: PassphraseGeneratorProps) {
  const [options, setOptions] = useState<PassphraseOptions>({
    wordCount: 4,
    separator: '-',
    includeNumbers: false,
    includeCasing: true,
    includeSymbols: false,
    randomSource: 'crypto'
  })

  const [passphrase, setPassphrase] = useState(() => generatePassphrase(options))
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const newPassphrase = generatePassphrase(options)
    setPassphrase(newPassphrase)
    if (onSelect) onSelect(newPassphrase)
  }, [options, onSelect])

  const handleGenerate = () => {
    const newPassphrase = generatePassphrase(options)
    setPassphrase(newPassphrase)
    setCopied(false)
    if (onSelect) onSelect(newPassphrase)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(passphrase)
    setCopied(true)
    toast({ description: "Passphrase copied to clipboard" })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Generated Passphrase */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 text-left p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors font-mono text-sm break-all"
          >
            {passphrase}
          </button>
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="icon" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={handleGenerate}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Click passphrase to copy</p>
      </div>

      {/* Word Count */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <Label className="text-sm font-medium">Words</Label>
          <span className="text-sm text-muted-foreground">{options.wordCount}</span>
        </div>
        <Slider
          value={[options.wordCount]}
          onValueChange={([value]) => setOptions(prev => ({ ...prev, wordCount: value }))}
          min={3}
          max={8}
          step={1}
        />
      </div>

      {/* Options */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Options</Label>
        <div className="grid gap-3">
          {[
            { key: 'includeCasing', label: 'Capitalize words' },
            { key: 'includeNumbers', label: 'Add numbers' },
            { key: 'includeSymbols', label: 'Add symbols' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <Label className="text-sm font-normal">{label}</Label>
              <Switch
                checked={options[key as keyof PassphraseOptions] as boolean}
                onCheckedChange={(checked) => setOptions(prev => ({ ...prev, [key]: checked }))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Random Source */}
      <RandomSourceSelector
        value={options.randomSource}
        onChange={(source) => setOptions(prev => ({ ...prev, randomSource: source }))}
      />
    </div>
  )
}
