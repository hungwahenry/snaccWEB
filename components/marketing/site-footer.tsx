import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="text-muted-foreground mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4 text-xs">
        <span>© {new Date().getFullYear()} Snacc</span>
        <nav className="flex items-center gap-5">
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms of Use
          </Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  )
}
