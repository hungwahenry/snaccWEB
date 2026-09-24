import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { AppCTA } from "./app-cta"
import { SiteFooter } from "./site-footer"
import { SiteHeader } from "./site-header"
import { StoreBanner } from "./store-banner"

export function LandingShell({
  children,
  cta,
  next,
  floatingHeader = false,
}: {
  children: ReactNode
  cta: string
  next: string
  floatingHeader?: boolean
}) {
  return (
    <div className="flex min-h-dvh justify-center">
      <div className="relative flex min-h-dvh w-full max-w-lg flex-col border-x border-border">
        <div className={cn(floatingHeader && "absolute inset-x-0 top-0 z-20")}>
          <SiteHeader />
        </div>
        <main className="flex-1">
          {children}
          <AppCTA title={cta} next={next} />
        </main>
        <SiteFooter />
      </div>
      <StoreBanner />
    </div>
  )
}
