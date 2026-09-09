"use client"

import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"
import { useMe } from "@/features/auth/hooks/use-me"
import { hasAdminAccess } from "@/lib/permissions"

/// The panel layout already refused anyone without a role before rendering. This only catches a
/// role revoked mid-session, and sends them back to the app rather than to a login they have.
export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const me = useMe()
  const denied =
    me.isError || (!!me.data && !hasAdminAccess(me.data.permissions))

  useEffect(() => {
    if (denied) router.replace("/home")
  }, [denied, router])

  return <>{children}</>
}
