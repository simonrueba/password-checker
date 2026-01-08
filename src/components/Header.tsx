import { Shield, Lock } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "./ThemeToggle"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-lg group-hover:bg-primary/30 transition-colors" />
              <div className="relative bg-primary/10 border border-primary/30 rounded p-2 group-hover:border-primary/50 transition-all">
                <Shield className="h-5 w-5 text-primary" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-mono font-bold text-sm sm:text-base tracking-tight leading-none">
                <span className="hidden sm:inline">PASSWORD SECURITY</span>
                <span className="sm:hidden">PSC</span>
              </span>
              <span className="font-mono text-[10px] sm:text-xs text-muted-foreground tracking-wider uppercase leading-none mt-0.5">
                <span className="hidden sm:inline">Digital Vault System</span>
                <span className="sm:hidden">Vault</span>
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 border border-border/50">
              <Lock className="h-3 w-3 text-primary" />
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                Secure
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}

