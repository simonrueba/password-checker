'use client'

import { useState } from 'react'
import { usePasswordValidation } from '../hooks/usePasswordValidation'
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'

export default function EnterprisePasswordChecker() {
  const [password, setPassword] = useState('')
  const { strength, validation, addToHistory } = usePasswordValidation(password)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validation.isValid) {
      addToHistory(password)
      alert('Password accepted and added to history!')
      setPassword('')
    }
  }

  const getProgressColor = (score: number) => {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500']
    return colors[score] || colors[0]
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Enterprise Password Strength Checker</CardTitle>
          <CardDescription>Enter a password to check its strength and compliance with security policies</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {strength && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Strength: {strength.strengthText}</span>
                    <span className="text-sm font-medium">{strength.score * 25}%</span>
                  </div>
                  <Progress value={strength.score * 25} className={`h-2 ${getProgressColor(strength.score)}`} />
                </div>
              )}
            </div>

            {strength && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Password Analysis</AlertTitle>
                <AlertDescription>
                  <p>Estimated crack time: {strength.guessTimeString}</p>
                  {strength.feedback.warning && (
                    <p className="text-yellow-600 dark:text-yellow-400">{strength.feedback.warning}</p>
                  )}
                  {strength.feedback.suggestions.length > 0 && (
                    <ul className="list-disc pl-5 mt-2">
                      {strength.feedback.suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Password Requirements:</h3>
              <ul className="space-y-1">
                {[
                  { check: password.length >= 12, text: 'At least 12 characters' },
                  { check: /[A-Z]/.test(password), text: 'At least one uppercase letter' },
                  { check: /[a-z]/.test(password), text: 'At least one lowercase letter' },
                  { check: /\d/.test(password), text: 'At least one number' },
                  { check: /[!@#$%^&*(),.?":{}|<>]/.test(password), text: 'At least one special character' },
                ].map(({ check, text }, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    {check ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {validation.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Validation Errors</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5">
                    {validation.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={!validation.isValid}>
              Submit Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

