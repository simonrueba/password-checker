import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { AlertTriangle } from 'lucide-react'

export type RandomSource = 'crypto' | 'system-random' | 'browser-random' | 'math'

interface RandomSourceSelectorProps {
  value: RandomSource
  onChange: (source: RandomSource) => void
}

export default function RandomSourceSelector({ value, onChange }: RandomSourceSelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Random Source</Label>
      <RadioGroup
        value={value}
        onValueChange={(value) => onChange(value as RandomSource)}
        className="flex flex-wrap gap-4"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="crypto" id="crypto" />
          <Label htmlFor="crypto" className="text-sm font-normal">Crypto API</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="system-random" id="system-random" />
          <Label htmlFor="system-random" className="text-sm font-normal">System</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="browser-random" id="browser-random" />
          <Label htmlFor="browser-random" className="text-sm font-normal">Browser</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="math" id="math" />
          <Label htmlFor="math" className="text-sm font-normal">Math.random</Label>
        </div>
      </RadioGroup>

      {value === 'math' && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm">
          <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
          <p className="text-yellow-800 dark:text-yellow-200">
            Math.random() is not cryptographically secure.
          </p>
        </div>
      )}
    </div>
  )
}
