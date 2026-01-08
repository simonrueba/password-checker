import { Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Breach checking powered by{' '}
            <a
              href="https://haveibeenpwned.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Have I Been Pwned
            </a>
          </p>

          <a
            href="https://github.com/simonrueba/password-checker"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            <span>Source</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
