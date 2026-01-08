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
    <div className="min-h-screen flex flex-col bg-background relative">
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-40" />
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative">
        <div className="max-w-[1100px] mx-auto space-y-8 sm:space-y-10">
          {/* Page Title */}
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-wider text-primary font-semibold">
                Secure Analysis Engine
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight font-mono">
              PASSWORD SECURITY
              <span className="block text-2xl sm:text-3xl lg:text-4xl text-primary mt-1">
                DIGITAL VAULT
              </span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-mono max-w-2xl mx-auto">
              Enterprise-grade password analysis and generation system
            </p>
          </div>

          {/* Password Tools */}
          <Card className="shadow-lg border-border/50 bg-card/50 backdrop-blur-sm vault-enter">
            <CardHeader className="border-b border-border/50 bg-muted/30 space-y-3 sm:space-y-4 px-4 sm:px-6 py-5 sm:py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 border border-primary/30 rounded p-2 glow-primary">
                    <Shield className="h-5 w-5 text-primary" strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col">
                    <CardTitle className="text-lg sm:text-xl font-mono font-bold tracking-tight">
                      SECURITY TOOLS
                    </CardTitle>
                    <CardDescription className="text-xs font-mono">
                      Analysis • Generation • Protection
                    </CardDescription>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded bg-primary/10 border border-primary/20">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-mono text-xs text-primary font-semibold uppercase tracking-wider">
                    Online
                  </span>
                </div>
              </div>
            </CardHeader>
            <div className="p-4 sm:p-6 lg:p-8">
              <Tabs defaultValue="check" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-3 mb-6 sm:mb-8 gap-2 bg-muted/50 p-1 rounded-lg border border-border/50">
                  <TabsTrigger
                    value="check"
                    className="font-mono font-semibold text-xs sm:text-sm uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md px-3 py-2.5 sm:py-3 rounded-md transition-all"
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="w-full">
                          Password Checker
                        </TooltipTrigger>
                        <TooltipContent>Alt + C</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TabsTrigger>

                  <TabsTrigger
                    value="generate"
                    className="font-mono font-semibold text-xs sm:text-sm uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md px-3 py-2.5 sm:py-3 rounded-md transition-all"
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="w-full">
                          Generator
                        </TooltipTrigger>
                        <TooltipContent>Alt + G</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TabsTrigger>

                  <TabsTrigger
                    value="passphrase"
                    className="font-mono font-semibold text-xs sm:text-sm uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md px-3 py-2.5 sm:py-3 rounded-md transition-all"
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="w-full">
                          Passphrase
                        </TooltipTrigger>
                        <TooltipContent>Alt + P</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="check" className="mt-4 sm:mt-6">
                  <PasswordChecker 
                    password={password} 
                    setPassword={setPassword}
                  />
                </TabsContent>

                <TabsContent value="generate" className="mt-4 sm:mt-6">
                  <PasswordGenerator onSelect={setPassword} />
                </TabsContent>

                <TabsContent value="passphrase" className="mt-4 sm:mt-6">
                  <PassphraseGenerator onSelect={setPassword} />
                </TabsContent>
              </Tabs>
            </div>
          </Card>

          {/* Security Analysis */}
          <Card className="shadow-lg border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b border-border/50 bg-muted/30 space-y-3 sm:space-y-4 px-4 sm:px-6 py-5 sm:py-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 border border-primary/30 rounded p-2">
                  <Shield className="h-5 w-5 text-primary" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <CardTitle className="text-lg sm:text-xl font-mono font-bold tracking-tight">
                    SECURITY ANALYSIS
                  </CardTitle>
                  <CardDescription className="text-xs font-mono">
                    Advanced strength assessment engine
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <div className="p-4 sm:p-6 lg:p-8">
              <SecurityAnalysis password={password} />
            </div>
          </Card>

          {/* Tips Section */}
          <Card className="shadow-lg border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b border-border/50 bg-muted/30 space-y-3 sm:space-y-4 px-4 sm:px-6 py-5 sm:py-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 border border-primary/30 rounded p-2">
                  <Shield className="h-5 w-5 text-primary" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <CardTitle className="text-lg sm:text-xl font-mono font-bold tracking-tight">
                    SECURITY GUIDELINES
                  </CardTitle>
                  <CardDescription className="text-xs font-mono">
                    Best practices for password security
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="grid gap-8 sm:gap-10 md:grid-cols-3">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-primary" />
                    <h3 className="text-base sm:text-lg font-mono font-bold tracking-tight">MAKE IT STRONG</h3>
                  </div>
                  <ul className="space-y-2.5 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="select-none">•</span>
                      <span>Use at least 12 characters</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="select-none">•</span>
                      <span>Mix letters, numbers & symbols</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="select-none">•</span>
                      <span>Try a memorable phrase instead</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="select-none">•</span>
                      <span>Avoid personal info (birthdays, names)</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-primary" />
                    <h3 className="text-base sm:text-lg font-mono font-bold tracking-tight">KEEP IT SAFE</h3>
                  </div>
                  <ul className="space-y-2.5 text-sm text-muted-foreground">
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
                      <span>Use unique passwords everywhere</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="select-none">•</span>
                      <span>Change if account is compromised</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-primary" />
                    <h3 className="text-base sm:text-lg font-mono font-bold tracking-tight">WHAT TO AVOID</h3>
                  </div>
                  <ul className="space-y-2.5 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="select-none">•</span>
                      <span>Simple patterns (123, abc, qwerty)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="select-none">•</span>
                      <span>Sharing passwords with others</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="select-none">•</span>
                      <span>Using the same password twice</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="select-none">•</span>
                      <span>Saving passwords in plain text</span>
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

