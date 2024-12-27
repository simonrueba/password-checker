import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, ShieldAlert, ShieldCheck, ShieldQuestion, Info, History, RefreshCw, AlertTriangle } from 'lucide-react'
import { checkPasswordStrength, StrengthResult } from '../utils/passwordStrength'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { calculateSimilarity } from '../utils/passwordSimilarity'

interface PasswordCheckerProps {
  password: string
  setPassword: (password: string) => void
}

export default function PasswordChecker({ password, setPassword }: PasswordCheckerProps) {
  const [strength, setStrength] = useState<StrengthResult | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordHistory, setPasswordHistory] = useState<Array<{password: string, strength: StrengthResult}>>([])
  const [showHistory, setShowHistory] = useState(false)
  const [similarityWarning, setSimilarityWarning] = useState<string | null>(null)

  useEffect(() => {
    if (password) {
      const newStrength = checkPasswordStrength(password)
      setStrength(newStrength)
      
      // Check similarity with previous passwords
      if (passwordHistory.length > 0) {
        const similarities = passwordHistory.map(hist => ({
          similarity: calculateSimilarity(password, hist.password),
          historyPassword: hist.password
        }))
        
        const highestSimilarity = similarities.reduce((max, curr) => 
          curr.similarity > max.similarity ? curr : max
        , { similarity: 0, historyPassword: '' })

        if (highestSimilarity.similarity > 0.7) {
          setSimilarityWarning("This password is too similar to a previous one")
        } else if (highestSimilarity.similarity > 0.5) {
          setSimilarityWarning("This password has some patterns similar to previous ones")
        } else {
          setSimilarityWarning(null)
        }
      }

      // Only add to history if it's a new password
      if (!passwordHistory.some(h => h.password === password)) {
        setPasswordHistory(prev => [...prev.slice(-4), { password: password, strength: newStrength }])
      }
    } else {
      setStrength(null)
      setSimilarityWarning(null)
    }
  }, [password])

  const getStrengthColor = (score: number) => {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500']
    return colors[score] || colors[0]
  }

  const getStrengthIcon = (score: number) => {
    switch (score) {
      case 0:
      case 1:
        return <ShieldAlert className="h-6 w-6 text-red-500" aria-hidden="true" />
      case 2:
        return <ShieldQuestion className="h-6 w-6 text-yellow-500" aria-hidden="true" />
      case 3:
      case 4:
        return <ShieldCheck className="h-6 w-6 text-green-500" aria-hidden="true" />
      default:
        return <Shield className="h-6 w-6 text-gray-500" aria-hidden="true" />
    }
  }

  const strengthDescription = strength ? {
    0: 'Very Weak - This password is extremely vulnerable to attacks',
    1: 'Weak - This password needs significant improvement',
    2: 'Moderate - This password provides basic security but could be stronger',
    3: 'Strong - This password provides good security',
    4: 'Very Strong - This password provides excellent security'
  }[strength.score] : ''

  const compareWithHistory = () => {
    if (passwordHistory.length === 0) return null
    const currentStrength = strength?.score || 0
    const averageHistoryStrength = passwordHistory
      .reduce((acc, curr) => acc + curr.strength.score, 0) / passwordHistory.length
    
    if (currentStrength > averageHistoryStrength) {
      return "This password is stronger than your previous ones!"
    } else if (currentStrength < averageHistoryStrength) {
      return "This password is weaker than your previous ones."
    }
    return "This password is similar in strength to your previous ones."
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-lg pr-24"
            aria-label="Password input"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </Button>
        </div>

        {similarityWarning && (
          <Alert variant="destructive" className="mt-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{similarityWarning}</AlertDescription>
          </Alert>
        )}

        {strength && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStrengthIcon(strength.score)}
                <span className="font-medium">{strength.strengthText}</span>
              </div>
              <span className="text-sm font-medium" role="status" aria-live="polite">
                {strength.score * 25}% Strong
              </span>
            </div>
            <Progress 
              value={strength.score * 25} 
              className="h-2"
              aria-label="Password strength indicator"
              indicatorClassName={getStrengthColor(strength.score)}
            />
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <p className="font-medium mb-2">{strengthDescription}</p>
                <ul className="text-sm space-y-1 list-disc pl-4">
                  {strength.feedback.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
                {strength.score < 3 && (
                  <div className="mt-2 p-2 rounded-md border">
                    <p className="text-sm font-medium">Tips for a stronger password:</p>
                    <ul className="text-sm list-disc pl-4 mt-1 space-y-1">
                      <li>Use a mix of uppercase and lowercase letters</li>
                      <li>Include numbers and special characters</li>
                      <li>Make it at least 12 characters long</li>
                      <li>Avoid common words and patterns</li>
                      <li>Don't use personal information</li>
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </Alert>

            {passwordHistory.length > 0 && (
              <div className="space-y-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  <History className="h-4 w-4" />
                  {showHistory ? "Hide History" : "Show Password History"}
                </Button>
                
                {showHistory && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{compareWithHistory()}</p>
                    {passwordHistory.map((hist, index) => (
                      <div key={index} className="flex items-center justify-between text-sm p-2 rounded-md border">
                        <div className="flex items-center gap-2">
                          {getStrengthIcon(hist.strength.score)}
                          <span>Password {index + 1}</span>
                        </div>
                        <span>{hist.strength.score * 25}% Strong</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex gap-2">
            <Button onClick={() => setPassword('')} className="flex-1">
              Generate Secure Password
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="w-10 h-10 p-0"
              onClick={() => setPassword('')}
              aria-label="Clear password"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            Your password is checked locally and never sent to any server
          </p>
        </div>
      </div>
    </div>
  )
}

