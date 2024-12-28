import { Shield, Github } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <span className="text-xs sm:text-sm text-muted-foreground">
              Password Security Center
            </span>
          </div>

          <div className="flex flex-col items-center gap-3 sm:gap-4 md:flex-row text-center md:text-left">
            <div className="text-xs sm:text-sm text-muted-foreground">
              Password breach checking powered by{' '}
              <a 
                href="https://haveibeenpwned.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-4 hover:text-primary"
              >
                Have I Been Pwned
              </a>
            </div>

            <a
              href="https://github.com/yourusername/password-checker"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-primary"
            >
              <Github className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

