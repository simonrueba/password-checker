import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from 'lucide-react'

export type RandomSource = 'crypto' | 'math' | 'node-crypto' | 'secure-random' | 'browser-random' | 'system-random'

interface RandomSourceSelectorProps {
  value: RandomSource
  onChange: (source: RandomSource) => void
}

export default function RandomSourceSelector({ value, onChange }: RandomSourceSelectorProps) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b bg-muted/50 p-4">
        <div className="space-y-1">
          <h3 className="font-semibold tracking-tight">Random Number Source</h3>
          <p className="text-sm text-muted-foreground">Choose how random numbers are generated</p>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <RadioGroup
          value={value}
          onValueChange={onChange}
        >
          <div className="grid gap-3">
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="crypto" id="crypto" />
                  <Label htmlFor="crypto" className="text-sm font-medium">Web Crypto API</Label>
                  <Badge variant="outline" className="ml-2">Recommended</Badge>
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  Cryptographically secure random number generation
                </p>
                <ul className="ml-6 mt-2 space-y-1 text-xs text-muted-foreground">
                  <li>• Highest security level</li>
                  <li>• Hardware-based entropy</li>
                  <li>• Unpredictable output</li>
                  <li>• Available in all modern browsers</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="system-random" id="system-random" />
                  <Label htmlFor="system-random" className="text-sm font-medium">System Random</Label>
                  <Badge variant="outline" className="ml-2">Secure</Badge>
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  System-provided random number generator
                </p>
                <ul className="ml-6 mt-2 space-y-1 text-xs text-muted-foreground">
                  <li>• Operating system entropy</li>
                  <li>• Hardware-based when available</li>
                  <li>• Good for most use cases</li>
                  <li>• Consistent across platforms</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="browser-random" id="browser-random" />
                  <Label htmlFor="browser-random" className="text-sm font-medium">Browser Random</Label>
                  <Badge variant="outline" className="ml-2">Mixed Sources</Badge>
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  Browser-specific random sources
                </p>
                <ul className="ml-6 mt-2 space-y-1 text-xs text-muted-foreground">
                  <li>• Uses multiple entropy sources</li>
                  <li>• Includes user interactions</li>
                  <li>• Performance timing data</li>
                  <li>• Mixed with crypto random</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm opacity-50">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="math" id="math" disabled />
                  <Label htmlFor="math" className="text-sm font-medium">Math.random()</Label>
                  <Badge variant="destructive" className="ml-2">Not Recommended</Badge>
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  JavaScript's built-in pseudo-random number generator
                </p>
                <ul className="ml-6 mt-2 space-y-1 text-xs text-muted-foreground">
                  <li>• Not cryptographically secure</li>
                  <li>• Implementation varies by browser</li>
                  <li>• Predictable sequence possible</li>
                  <li>• Included for educational purposes only</li>
                </ul>
              </div>
            </div>
          </div>
        </RadioGroup>

        <div className="rounded-lg border-2 border-yellow-600 bg-yellow-600/15 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-yellow-800 dark:text-yellow-400">
            <AlertTriangle className="h-4 w-4" />
            Important Security Note
          </div>
          <p className="mt-2 text-sm text-yellow-800/90 dark:text-yellow-300/90">
            For password generation and other security-critical operations, always use a cryptographically secure random number generator. The Web Crypto API is recommended as it provides the strongest security guarantees.
          </p>
        </div>
      </div>
    </Card>
  )
} 