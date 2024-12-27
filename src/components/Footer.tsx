import { Shield } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-8 lg:px-16 py-6">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold">Password Security Center</span>
          </div>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              About
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

