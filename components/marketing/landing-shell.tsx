import type { ReactNode } from "react"
import { AppCTA } from "./app-cta"
import { SiteFooter } from "./site-footer"
import { SiteHeader } from "./site-header"
import { StoreBanner } from "./store-banner"

export function LandingShell({ children, cta }: { children: ReactNode; cta: string }) {
  return (
    <div className="flex min-h-dvh justify-center">
      <div className="border-border flex min-h-dvh w-full max-w-lg flex-col border-x">
        <SiteHeader />
        <main className="flex-1">
          {children}
          <AppCTA title={cta} />
        </main>
        <SiteFooter />
      </div>
      <StoreBanner />
    </div>
  )
}
