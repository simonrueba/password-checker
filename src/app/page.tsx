'use client'

import { useState, useEffect } from 'react'
import Header from '../components/Header'
import PasswordChecker from '../components/PasswordChecker'
import SecurityAnalysis from "@/components/SecurityAnalysis"
import PasswordGenerator from '../components/PasswordGenerator'
import PassphraseGenerator from '../components/PassphraseGenerator'
import Footer from '../components/Footer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Shield } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Home() {
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('check')

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if not in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.altKey) {
        switch(e.key.toLowerCase()) {
          case 'c':
            setActiveTab('check')
            break
          case 'g':
            setActiveTab('generate')
            break
          case 'p':
            setActiveTab('passphrase')
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-8 lg:px-16 py-12">
        <div className="max-w-[1000px] mx-auto space-y-8">
          {/* Page Title */}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Password Security Center</h1>
            <p className="text-muted-foreground">Analyze, generate, and strengthen your passwords</p>
          </div>

          {/* Password Tools */}
          <Card className="shadow-sm">
            <CardHeader className="border-b bg-muted/50 space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Password Security</CardTitle>
              </div>
              <CardDescription>Check password strength and generate secure passwords</CardDescription>
            </CardHeader>
            <div className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-3 mb-6">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <TabsTrigger value="check">Password Checker</TabsTrigger>
                      </TooltipTrigger>
                      <TooltipContent>Alt + C</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <TabsTrigger value="generate">Password Generator</TabsTrigger>
                      </TooltipTrigger>
                      <TooltipContent>Alt + G</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <TabsTrigger value="passphrase">Passphrase Generator</TabsTrigger>
                      </TooltipTrigger>
                      <TooltipContent>Alt + P</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TabsList>
                
                <TabsContent value="check" className="mt-6">
                  <PasswordChecker 
                    password={password} 
                    setPassword={setPassword}
                  />
                </TabsContent>

                <TabsContent value="generate" className="mt-6">
                  <PasswordGenerator onSelect={setPassword} />
                </TabsContent>

                <TabsContent value="passphrase" className="mt-6">
                  <PassphraseGenerator onSelect={setPassword} />
                </TabsContent>
              </Tabs>
            </div>
          </Card>

          {/* Security Analysis */}
          <Card className="shadow-sm">
            <CardHeader className="border-b bg-muted/50 space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Security Analysis</CardTitle>
              </div>
              <CardDescription>Advanced password strength assessment</CardDescription>
            </CardHeader>
            <div className="p-6">
              <SecurityAnalysis password={password} />
            </div>
          </Card>

          {/* Tips Section */}
          <Card className="shadow-sm">
            <CardHeader className="border-b bg-muted/50 space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Security Guidelines</CardTitle>
              </div>
              <CardDescription>Best practices for strong passwords</CardDescription>
            </CardHeader>
            <div className="p-6">
              <div className="grid gap-8 md:grid-cols-3">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Password Best Practices</h3>
                  <ul className="space-y-2.5 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="select-none">•</span>
                      <span>Use at least 12 characters</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="select-none">•</span>
                      <span>Mix uppercase and lowercase</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="select-none">•</span>
                      <span>Include numbers and symbols</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="select-none">•</span>
                      <span>Avoid personal information</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Security Tips</h3>
                  <ul className="space-y-2.5 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="select-none">•</span>
                      <span>Never reuse passwords</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="select-none">•</span>
                      <span>Use a password manager</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="select-none">•</span>
                      <span>Enable two-factor authentication</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="select-none">•</span>
                      <span>Change passwords regularly</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Common Mistakes</h3>
                  <ul className="space-y-2.5 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="select-none">•</span>
                      <span>Using dictionary words</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="select-none">•</span>
                      <span>Sequential characters (123, abc)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="select-none">•</span>
                      <span>Keyboard patterns (qwerty)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="select-none">•</span>
                      <span>Simple substitutions (@ for a)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

