import { Shield } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "./ThemeToggle"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-70">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shield className="h-4 w-4" strokeWidth={2} />
            </div>
            <span className="font-semibold tracking-tight">
              Password Checker
            </span>
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
