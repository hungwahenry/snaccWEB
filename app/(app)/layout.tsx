import { HydrationBoundary } from "@tanstack/react-query"
import type { ReactNode } from "react"
import { AppShell } from "@/features/navigation/screens/app-shell"
import { hasSession } from "@/lib/auth-server"
import { prefetchAppConfig } from "@/lib/config-server"

export default async function AppLayout({ children }: { children: ReactNode }) {
  const [session, config] = await Promise.all([
    hasSession(),
    prefetchAppConfig(),
  ])

  // Seeded before anything renders, so a flag-gated screen never shows its off state first.
  const withConfig = (
    <HydrationBoundary state={config}>{children}</HydrationBoundary>
  )

  if (!session) return withConfig

  return <AppShell>{withConfig}</AppShell>
}
