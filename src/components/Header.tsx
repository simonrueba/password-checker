import { Shield } from "lucide-react"
import Link from "next/link"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="hidden sm:inline-block font-semibold">
              Password Security Center
            </span>
            <span className="sm:hidden font-semibold">
              PSC
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}

