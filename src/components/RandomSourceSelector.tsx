import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useState } from 'react'

export type RandomSource = 'crypto' | 'system-random' | 'browser-random' | 'math'

interface RandomSourceSelectorProps {
  value: RandomSource
  onChange: (source: RandomSource) => void
}

export default function RandomSourceSelector({ value, onChange }: RandomSourceSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="space-y-1">
          <h4 className="text-sm font-medium">Random Number Source</h4>
          <p className="text-xs text-muted-foreground">Choose how random numbers are generated</p>
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
        <>
          <RadioGroup
            value={value}
            onValueChange={(value) => onChange(value as RandomSource)}
            className="grid gap-3"
          >
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Cryptographic Random</Label>
                <p className="text-xs text-muted-foreground">
                  Uses Web Crypto API for secure random numbers
                </p>
              </div>
              <RadioGroupItem value="crypto" id="crypto" />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">System Random</Label>
                <p className="text-xs text-muted-foreground">
                  Uses system-level entropy sources
                </p>
              </div>
              <RadioGroupItem value="system-random" id="system-random" />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Browser Random</Label>
                <p className="text-xs text-muted-foreground">
                  Uses browser-specific entropy sources
                </p>
              </div>
              <RadioGroupItem value="browser-random" id="browser-random" />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Math.random()</Label>
                <p className="text-xs text-muted-foreground">
                  Uses JavaScript's built-in random number generator
                </p>
              </div>
              <RadioGroupItem value="math" id="math" />
            </div>
          </RadioGroup>

          {value === 'math' && (
            <Card className="mt-4 border-2 border-yellow-600 bg-yellow-600/15 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-yellow-800 dark:text-yellow-400">
                <AlertTriangle className="h-4 w-4" />
                Security Warning
              </div>
              <p className="mt-2 text-sm text-yellow-800/90 dark:text-yellow-300/90">
                Math.random() is not cryptographically secure and should not be used for generating passwords in production.
              </p>
            </Card>
          )}
        </>
      )}
    </Card>
  )
} 