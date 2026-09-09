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

  // Above the shell, not inside it. The shell reads flags itself and holds children back until
  // the account loads, so a boundary any lower would hydrate after everything had already
  // rendered against an empty config — which is the flash it exists to prevent.
  return (
    <HydrationBoundary state={config}>
      {session ? <AppShell>{children}</AppShell> : children}
    </HydrationBoundary>
  )
}
