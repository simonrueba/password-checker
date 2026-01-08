import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Eye, EyeOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useState } from 'react'

interface PasswordCheckerProps {
  password: string
  setPassword: (password: string) => void
}

export default function PasswordChecker({ password, setPassword }: PasswordCheckerProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-border/50 bg-muted/20">
        <div className="p-5 sm:p-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                <span className="font-mono text-xs text-primary font-semibold">$</span>
                <span className="font-mono text-xs text-muted-foreground">INPUT:</span>
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password for analysis..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-[85px] pr-12 h-12 font-mono text-sm bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 hover:bg-muted/50 border border-transparent hover:border-primary/30 transition-all"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

