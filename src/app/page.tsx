'use client'

import { useState, useEffect } from 'react'
import Header from '../components/Header'
import PasswordChecker from '../components/PasswordChecker'
import SecurityAnalysis from "@/components/SecurityAnalysis"
import PasswordGenerator from '../components/PasswordGenerator'
import PassphraseGenerator from '../components/PassphraseGenerator'
import Footer from '../components/Footer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KeyRound, Shuffle, Type } from 'lucide-react'

export default function Home() {
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('check')

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
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

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
                Password Security
              </h1>
              <p className="text-muted-foreground">
                Check strength, detect breaches, generate secure passwords
              </p>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-8">
                <TabsTrigger value="check" className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4" />
                  <span className="hidden sm:inline">Check</span>
                </TabsTrigger>
                <TabsTrigger value="generate" className="flex items-center gap-2">
                  <Shuffle className="h-4 w-4" />
                  <span className="hidden sm:inline">Generate</span>
                </TabsTrigger>
                <TabsTrigger value="passphrase" className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  <span className="hidden sm:inline">Passphrase</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="check" className="mt-0">
                <PasswordChecker
                  password={password}
                  setPassword={setPassword}
                />
              </TabsContent>

              <TabsContent value="generate" className="mt-0">
                <PasswordGenerator onSelect={setPassword} />
              </TabsContent>

              <TabsContent value="passphrase" className="mt-0">
                <PassphraseGenerator onSelect={setPassword} />
              </TabsContent>
            </Tabs>

            {/* Analysis */}
            {password && (
              <div className="mt-12 pt-12 border-t">
                <h2 className="text-lg font-semibold mb-6">Security Analysis</h2>
                <SecurityAnalysis password={password} />
              </div>
            )}
          </div>

          {/* Tips - wider, outside the narrow column */}
          <div className="max-w-3xl mx-auto mt-20 pt-12 border-t">
            <h2 className="sr-only">Password Tips</h2>
            <div className="grid gap-8 sm:grid-cols-3 text-center sm:text-left">
              <div>
                <h3 className="font-medium mb-3">Strong passwords</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>Use 12+ characters</li>
                  <li>Mix letters, numbers, symbols</li>
                  <li>Avoid personal info</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3">Stay safe</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>Use a password manager</li>
                  <li>Enable 2FA when available</li>
                  <li>Use unique passwords</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3">Avoid</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>Common patterns (123, abc)</li>
                  <li>Sharing passwords</li>
                  <li>Reusing passwords</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
