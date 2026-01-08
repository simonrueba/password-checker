import { Input } from "@/components/ui/input"
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
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder="Enter a password to check..."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="pr-10 h-12 text-base"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
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
  )
}
