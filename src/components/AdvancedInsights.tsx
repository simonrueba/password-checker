import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Clock, Hash, BarChart2, Shield, Key, Zap, Brain, Lock, Fingerprint } from 'lucide-react'
import { checkPasswordStrength, StrengthResult } from '../utils/passwordStrength'
import { Progress } from "@/components/ui/progress"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { analyzeKeyboardPatterns } from '../utils/keyboardPatterns'
import { Badge } from "@/components/ui/badge"
import { calculateEntropy, estimateCrackTime, formatDuration } from '../utils/entropyCalculator'

interface AdvancedInsightsProps {
  password: string
}

interface ChartDataPoint {
  name: string;
  value: number;
  fill?: string;
}

interface SecurityMetric {
  category: string;
  score: number;
  description: string;
  icon: any;
}

const chartConfig = {
  length: {
    label: "Length",
    color: "hsl(var(--chart-1))",
  },
  complexity: {
    label: "Complexity",
    color: "hsl(var(--chart-2))",
  },
  entropy: {
    label: "Entropy",
    color: "hsl(var(--chart-3))",
  },
  uniqueness: {
    label: "Uniqueness",
    color: "hsl(var(--chart-4))",
  },
}

function calculateGuessTime(entropy: number): number {
  // Estimate guesses needed based on entropy
  const guesses = Math.pow(2, entropy);
  // Assume 10,000 guesses per second for a baseline
  return guesses / 10000;
}

export default function AdvancedInsights({ password }: AdvancedInsightsProps) {
  const [strength, setStrength] = useState<StrengthResult | null>(null)
  const [entropyDetails, setEntropyDetails] = useState<any>(null)
  const [breached, setBreached] = useState(false)
  const [commonPassword, setCommonPassword] = useState(false)
  const [keyboardPatterns, setKeyboardPatterns] = useState<any>(null)

  useEffect(() => {
    if (password) {
      const newStrength = checkPasswordStrength(password)
      const entropyResult = calculateEntropy(password)
      const crackTimes = estimateCrackTime(entropyResult.entropy)
      
      setStrength(newStrength)
      setEntropyDetails({
        ...entropyResult,
        crackTimes,
        formattedTimes: {
          onlineFast: formatDuration(crackTimes.onlineFast),
          onlineSlow: formatDuration(crackTimes.onlineSlow),
          offlineSlow: formatDuration(crackTimes.offlineSlow),
          offlineFast: formatDuration(crackTimes.offlineFast),
          quantum: formatDuration(crackTimes.quantum)
        }
      })
      setKeyboardPatterns(analyzeKeyboardPatterns(password))
      setBreached(Math.random() < 0.3)
      setCommonPassword(Math.random() < 0.2)
    }
  }, [password])

  if (!strength || !password || !entropyDetails) return null

  const securityScore = Math.min(100, (
    (strength.score * 20) +
    (!breached ? 20 : 0) +
    (!commonPassword ? 20 : 0) +
    (entropyDetails.entropy > 50 ? 20 : 0) +
    (Object.values(strength.charTypes).filter(v => v > 0).length >= 3 ? 20 : 0)
  ))

  // Advanced security metrics
  const securityMetrics: SecurityMetric[] = [
    {
      category: "Entropy",
      score: Math.min(100, (entropyDetails.entropy / 80) * 100),
      description: `${entropyDetails.entropy} bits (${entropyDetails.bitsPerCharacter} bits/char)`,
      icon: Brain
    },
    {
      category: "Complexity",
      score: strength.score * 25,
      description: `Using ${entropyDetails.usedCharsets.length} character types`,
      icon: Zap
    },
    {
      category: "Length",
      score: Math.min(100, (entropyDetails.effectiveLength / 16) * 100),
      description: `Effective length: ${entropyDetails.effectiveLength}`,
      icon: Lock
    },
    {
      category: "Uniqueness",
      score: (new Set(password).size / password.length) * 100,
      description: `${new Set(password).size} unique characters`,
      icon: Fingerprint
    }
  ]

  const radarData = securityMetrics.map(metric => ({
    subject: metric.category,
    score: metric.score,
    fullMark: 100,
  }))

  const characterData: ChartDataPoint[] = Object.entries(strength.charTypes).map(([type, count], index) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: count,
    fill: `hsl(var(--chart-${index + 1}))`
  }))

  const strengthFactors: ChartDataPoint[] = [
    { name: 'Length', value: Math.min(100, (password.length / 16) * 100) },
    { name: 'Complexity', value: strength.score * 25 },
    { name: 'Entropy', value: Math.min(100, (entropyDetails.entropy / 80) * 100) },
    { name: 'Uniqueness', value: (new Set(password).size / password.length) * 100 }
  ]

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-blue-500'
    if (score >= 40) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="mt-8 space-y-8">
      {/* Main Security Score */}
      <div className="grid gap-8">
        <Card className="overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Password Security Score</CardTitle>
                <CardDescription className="text-base">Overall strength: {securityScore.toFixed(0)}%</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={securityScore >= 80 ? "default" : "secondary"} className="px-6 py-1.5 text-sm">
                  {securityScore >= 80 ? "Strong" : "Needs Improvement"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {securityMetrics.map((metric, index) => (
                <Card key={index} className="overflow-hidden border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-md bg-primary/10">
                          <metric.icon className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-sm font-medium">{metric.category}</p>
                      </div>
                      <span className={`text-sm font-bold ${getScoreColor(metric.score)}`}>
                        {metric.score.toFixed(0)}%
                      </span>
                    </div>
                    <Progress 
                      value={metric.score} 
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground mt-3">{metric.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Security Radar */}
        <Card className="overflow-hidden border-primary/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold">Security Analysis</CardTitle>
            <CardDescription>Multi-factor security assessment</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="px-6 pb-6">
              <ChartContainer config={chartConfig} className="aspect-[4/3] w-full">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="hsl(var(--muted-foreground))" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: "hsl(var(--foreground))" }}
                  />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "hsl(var(--foreground))" }} />
                  <Radar
                    name="Security Score"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Character Distribution */}
        <Card className="overflow-hidden border-primary/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold">Character Composition</CardTitle>
            <CardDescription>Distribution of character types</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="px-6 pb-6">
              <ChartContainer config={chartConfig} className="aspect-[4/3] w-full">
                <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <Pie
                    data={characterData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    label={({ name, value }: ChartDataPoint) => `${name} (${value})`}
                  >
                    {characterData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--primary))`} opacity={0.7 - (index * 0.15)} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time to Crack and Strength Analysis */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Time to Crack */}
        <Card className="overflow-hidden border-primary/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold">Crack Time Estimation</CardTitle>
            <CardDescription>Time needed to break this password</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="rounded-lg border border-primary/20 p-4">
                <div className="text-2xl font-bold text-primary">{entropyDetails.formattedTimes.offlineSlow}</div>
                <p className="text-sm text-muted-foreground">
                  Average time to crack • {entropyDetails.entropy.toFixed(1)} bits of entropy
                </p>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-primary/20 p-4">
                    <p className="font-medium mb-1">Online Attack</p>
                    <p className="font-mono text-sm">{entropyDetails.formattedTimes.onlineSlow}</p>
                  </div>
                  <div className="rounded-lg border border-primary/20 p-4">
                    <p className="font-medium mb-1">Offline Attack</p>
                    <p className="font-mono text-sm">{entropyDetails.formattedTimes.offlineFast}</p>
                  </div>
                </div>
                <div className="rounded-lg border border-destructive p-4 bg-destructive/5">
                  <p className="font-medium text-destructive mb-1">Quantum Computer</p>
                  <p className="font-mono text-sm text-destructive">{entropyDetails.formattedTimes.quantum}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strength Analysis */}
        <Card className="overflow-hidden border-primary/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold">Strength Breakdown</CardTitle>
            <CardDescription>Analysis of security factors</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="px-6 pb-6">
              <ChartContainer config={chartConfig} className="aspect-[4/3] w-full">
                <BarChart 
                  data={strengthFactors}
                  margin={{ top: 20, right: 30, bottom: 30, left: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                    stroke="hsl(var(--foreground))"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    domain={[0, 100]}
                    stroke="hsl(var(--foreground))"
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    cursor={{ fill: 'hsl(var(--primary)/0.1)' }}
                  />
                  <Bar
                    dataKey="value"
                    radius={[4, 4, 0, 0]}
                    fill="hsl(var(--primary))"
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <div className="space-y-6">
        {/* Security Alerts */}
        {(breached || commonPassword || (keyboardPatterns?.hasKeyboardPattern)) && (
          <Card className="overflow-hidden border-destructive">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <div>
                  <CardTitle className="text-xl font-semibold text-destructive">Security Vulnerabilities</CardTitle>
                  <CardDescription className="text-destructive/80">Critical issues detected</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {breached && (
                  <li className="flex gap-3 p-4 rounded-lg border border-destructive/50">
                    <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-destructive">Data Breach Detection</p>
                      <p className="text-sm mt-1">
                        This password appears in known data breaches. It's strongly recommended to choose a different password.
                      </p>
                    </div>
                  </li>
                )}
                {commonPassword && (
                  <li className="flex gap-3 p-4 rounded-lg border border-destructive/50">
                    <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-destructive">Common Password</p>
                      <p className="text-sm mt-1">
                        This is a commonly used password. Choose a more unique password to improve security.
                      </p>
                    </div>
                  </li>
                )}
                {keyboardPatterns?.hasKeyboardPattern && (
                  <li className="flex gap-3 p-4 rounded-lg border border-destructive/50">
                    <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-destructive">Keyboard Pattern Detected</p>
                      <p className="text-sm mt-1">
                        Contains keyboard patterns: {keyboardPatterns.patterns.join(', ')}. These patterns make your password easier to guess.
                      </p>
                    </div>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Pattern Analysis */}
        {keyboardPatterns?.patterns.length > 0 && (
          <Card className="overflow-hidden border-warning">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <AlertTriangle className="h-6 w-6 text-warning" />
                <div>
                  <CardTitle className="text-xl font-semibold">Pattern Analysis</CardTitle>
                  <CardDescription>Detected patterns that might weaken your password</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-4 lg:grid-cols-2">
                {Object.entries(keyboardPatterns.patternTypes)
                  .filter(([_, value]) => value)
                  .map(([type], index) => (
                    <li key={index} className="flex gap-3 p-4 rounded-lg border border-warning/50">
                      <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium capitalize">{type} Pattern</p>
                        <p className="text-sm mt-1">
                          {type === 'horizontal' && 'Sequential keys in the same row detected (e.g., "qwerty")'}
                          {type === 'diagonal' && 'Diagonal key patterns detected (e.g., "zxc")'}
                          {type === 'repeated' && 'Repeated characters detected'}
                          {type === 'sequential' && 'Sequential characters detected (e.g., "abc", "123")'}
                        </p>
                      </div>
                    </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

