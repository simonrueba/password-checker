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
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-[1000px] mx-auto space-y-6 sm:space-y-8">
          {/* Page Title */}
          <div className="space-y-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Password Security Center</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Analyze, generate, and strengthen your passwords</p>
          </div>

          {/* Password Tools */}
          <Card className="shadow-sm">
            <CardHeader className="border-b bg-muted/50 space-y-2 sm:space-y-3 px-4 sm:px-6">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <CardTitle className="text-lg sm:text-xl">Password Security</CardTitle>
              </div>
              <CardDescription className="text-sm">Check password strength and generate secure passwords</CardDescription>
            </CardHeader>
            <div className="p-4 sm:p-6">
              <Tabs defaultValue="check" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-3 mb-4 sm:mb-6 gap-1 sm:gap-2 bg-transparent">
                  <TabsTrigger 
                    value="check" 
                    className="bg-background hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm px-2 py-2 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-normal h-auto min-h-[40px] sm:min-h-[44px] text-center"
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
                    className="bg-background hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm px-2 py-2 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-normal h-auto min-h-[40px] sm:min-h-[44px] text-center"
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="w-full">
                          Password Generator
                        </TooltipTrigger>
                        <TooltipContent>Alt + G</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TabsTrigger>

                  <TabsTrigger 
                    value="passphrase"
                    className="bg-background hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm px-2 py-2 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-normal h-auto min-h-[40px] sm:min-h-[44px] text-center"
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="w-full">
                          Passphrase Generator
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
          <Card className="shadow-sm">
            <CardHeader className="border-b bg-muted/50 space-y-2 sm:space-y-3 px-4 sm:px-6">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <CardTitle className="text-lg sm:text-xl">Security Analysis</CardTitle>
              </div>
              <CardDescription className="text-sm">Advanced password strength assessment</CardDescription>
            </CardHeader>
            <div className="p-4 sm:p-6">
              <SecurityAnalysis password={password} />
            </div>
          </Card>

          {/* Tips Section */}
          <Card className="shadow-sm">
            <CardHeader className="border-b bg-muted/50 space-y-2 sm:space-y-3 px-4 sm:px-6">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <CardTitle className="text-lg sm:text-xl">Quick Security Tips</CardTitle>
              </div>
              <CardDescription className="text-sm">Simple steps to keep your accounts safe</CardDescription>
            </CardHeader>
            <div className="p-4 sm:p-6">
              <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-semibold">Make it Strong</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
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
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-semibold">Keep it Safe</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
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
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-semibold">What to Avoid</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
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

