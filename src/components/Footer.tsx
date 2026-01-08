import { Shield, Github, Terminal } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative border-t border-border/50 bg-muted/30">
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-50" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 border border-primary/30 rounded p-1.5">
              <Shield className="h-4 w-4 text-primary" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xs font-semibold tracking-tight">
                PASSWORD SECURITY
              </span>
              <span className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">
                v2.0.0 • Digital Vault
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row text-center sm:text-left">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Terminal className="h-3 w-3" />
              <span className="font-mono">
                Breach checking via{' '}
                <a
                  href="https://haveibeenpwned.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors font-semibold"
                >
                  HIBP
                </a>
              </span>
            </div>

            <div className="h-4 w-px bg-border/50 hidden sm:block" />

            <a
              href="https://github.com/simonrueba/password-checker"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors group"
            >
              <Github className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform" />
              <span className="font-mono uppercase tracking-wider">Open Source</span>
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border/50 flex justify-center">
          <p className="font-mono text-[10px] text-muted-foreground/70 uppercase tracking-widest">
            Securing Your Digital Identity • Est. 2024
          </p>
        </div>
      </div>
    </footer>
  )
}
