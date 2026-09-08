import type { ReactNode } from "react"
import { AppShell } from "@/features/navigation/screens/app-shell"
import { hasSession } from "@/lib/auth-server"

export default async function AppLayout({ children }: { children: ReactNode }) {
  if (!(await hasSession())) return <>{children}</>

  return <AppShell>{children}</AppShell>
}
