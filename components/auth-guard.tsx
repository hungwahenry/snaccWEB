"use client"

import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"
import { Spinner } from "@/components/ui/spinner"
import { useMe } from "@/features/auth/hooks/use-auth"

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const me = useMe()
  const denied = me.isError || (!!me.data && me.data.role !== "admin")

  useEffect(() => {
    if (denied) router.replace("/login")
  }, [denied, router])

  if (me.isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner />
      </div>
    )
  }
  if (denied || !me.data) return null

  return <>{children}</>
}
