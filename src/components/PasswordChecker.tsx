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
      <Card className="overflow-hidden">
        <div className="p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password to check"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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

