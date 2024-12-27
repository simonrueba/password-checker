import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Copy, RefreshCw } from 'lucide-react'
import { Label } from "@/components/ui/label"

interface PassphraseGeneratorProps {
  onSelect?: (passphrase: string) => void
}

// Word lists for generating memorable passphrases
const ADJECTIVES = [
  'happy', 'brave', 'bright', 'calm', 'clever', 'eager', 'fair', 'gentle', 'kind', 'lively', 'proud', 'wise',
  'swift', 'bold', 'quick', 'sharp', 'strong', 'warm', 'wild', 'young', 'free', 'pure', 'rich', 'safe',
  'deep', 'dark', 'light', 'soft', 'loud', 'quiet', 'sweet', 'tall', 'tiny', 'vast', 'warm', 'cool'
]

const NOUNS = [
  'tiger', 'river', 'mountain', 'forest', 'ocean', 'desert', 'island', 'garden', 'castle', 'valley', 'eagle', 'dragon',
  'crystal', 'diamond', 'emerald', 'falcon', 'harbor', 'jungle', 'knight', 'lotus', 'meteor', 'nebula', 'oasis', 'pearl',
  'phoenix', 'rainbow', 'shadow', 'thunder', 'unicorn', 'volcano', 'warrior', 'wizard', 'zenith', 'horizon', 'storm', 'star'
]

const VERBS = [
  'jumps', 'flows', 'glows', 'flies', 'grows', 'leads', 'runs', 'sings', 'walks', 'swims', 'dances', 'shines',
  'soars', 'races', 'leaps', 'rides', 'glides', 'floats', 'climbs', 'dives', 'dreams', 'guards', 'rules', 'seeks',
  'sparks', 'waves', 'burns', 'calls', 'falls', 'rises', 'spins', 'turns', 'moves', 'plays', 'stays', 'wins'
]

function generatePassphrase(options: {
  wordCount: number,
  includeCasing: boolean,
  includeNumbers: boolean,
  includeSymbols: boolean,
  separator: string
}): string {
  const { wordCount, includeCasing, includeNumbers, includeSymbols, separator } = options
  
  let words: string[] = []
  const usedWords = new Set<string>() // Prevent word repetition
  
  for (let i = 0; i < wordCount; i++) {
    const pattern = i % 3
    let word = ''
    let attempts = 0
    const maxAttempts = 10
    
    // Try to get a unique word
    do {
      switch (pattern) {
        case 0:
          word = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
          break
        case 1:
          word = NOUNS[Math.floor(Math.random() * NOUNS.length)]
          break
        case 2:
          word = VERBS[Math.floor(Math.random() * VERBS.length)]
          break
      }
      attempts++
    } while (usedWords.has(word.toLowerCase()) && attempts < maxAttempts)
    
    usedWords.add(word.toLowerCase())
    
    if (includeCasing && (Math.random() > 0.5 || pattern === 1)) { // Always capitalize nouns
      word = word.charAt(0).toUpperCase() + word.slice(1)
    }
    
    if (includeNumbers && Math.random() > 0.7) {
      const num = Math.floor(Math.random() * 1000)
      word += (num < 10 ? '0' : '') + num // Ensure at least 2 digits
    }
    
    if (includeSymbols && Math.random() > 0.7) {
      const symbols = ['!', '@', '#', '$', '%', '&', '*', '?', '+', '=']
      word += symbols[Math.floor(Math.random() * symbols.length)]
    }
    
    words.push(word)
  }
  
  return words.join(separator)
}

function estimatePassphraseStrength(passphrase: string): {
  score: number
  label: 'weak' | 'moderate' | 'strong' | 'very-strong'
} {
  const length = passphrase.length
  const words = passphrase.split(/[-_\s]/).length
  const hasUpperCase = /[A-Z]/.test(passphrase)
  const hasNumber = /\d/.test(passphrase)
  const hasSymbol = /[^A-Za-z0-9\s-_]/.test(passphrase)
  
  let score = 0
  score += Math.min(length * 4, 40) // Length up to 40 points
  score += words * 10 // 10 points per word
  score += hasUpperCase ? 10 : 0
  score += hasNumber ? 10 : 0
  score += hasSymbol ? 10 : 0
  
  if (score >= 90) return { score, label: 'very-strong' }
  if (score >= 70) return { score, label: 'strong' }
  if (score >= 50) return { score, label: 'moderate' }
  return { score, label: 'weak' }
}

export default function PassphraseGenerator({ onSelect }: PassphraseGeneratorProps) {
  const [options, setOptions] = useState({
    wordCount: 4,
    includeCasing: true,
    includeNumbers: true,
    includeSymbols: true,
    separator: '-'
  })

  const [passphrase, setPassphrase] = useState(() => generatePassphrase(options))
  const [copied, setCopied] = useState(false)

  const handleGenerate = () => {
    const newPassphrase = generatePassphrase(options)
    setPassphrase(newPassphrase)
    setCopied(false)
    if (onSelect) onSelect(newPassphrase)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(passphrase)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const strength = estimatePassphraseStrength(passphrase)
  const getStrengthColor = (label: string) => {
    switch (label) {
      case 'very-strong': return 'bg-green-500'
      case 'strong': return 'bg-blue-500'
      case 'moderate': return 'bg-yellow-500'
      default: return 'bg-red-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Generated Passphrase */}
      <Card className="overflow-hidden">
        <div className="border-b bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold tracking-tight">Generated Passphrase</h3>
              <p className="text-sm text-muted-foreground">Click the passphrase to copy it</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">
                {strength.score}%
              </Badge>
              <Badge className={getStrengthColor(strength.label)}>
                {strength.label}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <Card 
              className="flex-1 bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer border-primary/20" 
              onClick={handleCopy}
            >
              <CardContent className="p-4">
                <code className="text-sm md:text-base font-mono break-all select-all">{passphrase}</code>
              </CardContent>
            </Card>
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleCopy} 
                className="shrink-0 hover:bg-muted"
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy passphrase</span>
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleGenerate} 
                className="shrink-0 hover:bg-muted"
                title="Generate new passphrase"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="sr-only">Generate new passphrase</span>
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

      {/* Options */}
      <Card className="overflow-hidden">
        <div className="border-b bg-muted/50 p-4">
          <div className="space-y-1">
            <h3 className="font-semibold tracking-tight">Passphrase Options</h3>
            <p className="text-sm text-muted-foreground">Customize your passphrase generation</p>
          </div>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Word Count */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Word Count</Label>
                <span className="text-sm text-muted-foreground">{options.wordCount} words</span>
              </div>
              <Slider
                value={[options.wordCount]}
                onValueChange={([value]) => setOptions(prev => ({ ...prev, wordCount: value }))}
                min={3}
                max={8}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">More words increase security but decrease memorability</p>
            </div>
          </div>

          {/* Security Options */}
          <div className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Capital Letters</Label>
                  <p className="text-xs text-muted-foreground">Mix uppercase and lowercase letters</p>
                </div>
                <Switch
                  checked={options.includeCasing}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeCasing: checked }))}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Numbers</Label>
                  <p className="text-xs text-muted-foreground">Add random numbers to words</p>
                </div>
                <Switch
                  checked={options.includeNumbers}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeNumbers: checked }))}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Symbols</Label>
                  <p className="text-xs text-muted-foreground">Include special characters</p>
                </div>
                <Switch
                  checked={options.includeSymbols}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeSymbols: checked }))}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
} 