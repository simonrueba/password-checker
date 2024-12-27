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
                  <Label htmlFor="crypto" className="text-sm font-medium">Web Crypto API (Recommended)</Label>
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  Uses browser's crypto.getRandomValues() - Cryptographically secure, hardware-backed when available
                </p>
                <ul className="ml-6 mt-2 space-y-1 text-xs text-muted-foreground">
                  <li>• NIST-certified cryptographic random number generation</li>
                  <li>• Hardware-backed on modern devices</li>
                  <li>• Designed for cryptographic operations</li>
                  <li>• Available in all modern browsers</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="system-random" id="system-random" />
                  <Label htmlFor="system-random" className="text-sm font-medium">System Random</Label>
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  Uses operating system's random number generator and entropy pool
                </p>
                <ul className="ml-6 mt-2 space-y-1 text-xs text-muted-foreground">
                  <li>• Uses OS-level entropy sources</li>
                  <li>• Hardware events and system noise</li>
                  <li>• High-quality randomness</li>
                  <li>• Falls back to Web Crypto if unavailable</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="browser-random" id="browser-random" />
                  <Label htmlFor="browser-random" className="text-sm font-medium">Enhanced Browser Random</Label>
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  Combines multiple browser-based entropy sources
                </p>
                <ul className="ml-6 mt-2 space-y-1 text-xs text-muted-foreground">
                  <li>• Uses performance timing</li>
                  <li>• Mouse movement entropy</li>
                  <li>• Mixed with Web Crypto</li>
                  <li>• Additional browser entropy sources</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm opacity-50">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="math" id="math" disabled />
                  <Label htmlFor="math" className="text-sm font-medium">Math.random()</Label>
                  <Badge variant="outline" className="ml-2">Not Recommended</Badge>
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

        <div className="rounded-lg border border-yellow-200/30 bg-yellow-50/30 p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-yellow-900/70">
            <AlertTriangle className="h-4 w-4" />
            Important Security Note
          </div>
          <p className="mt-2 text-sm text-yellow-800/70">
            For password generation and other security-critical operations, always use a cryptographically secure random number generator. The Web Crypto API is recommended as it provides the strongest security guarantees.
          </p>
        </div>
      </div>
    </Card>
  )
} 