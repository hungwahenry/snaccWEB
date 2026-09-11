"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useMe } from "@/features/auth/hooks/use-me"
import { panelAccess } from "../utils/panel-access"

export function usePanelAccess(pathname: string) {
  const router = useRouter()
  const me = useMe()

  const access = panelAccess({
    pathname,
    permissions: me.data?.permissions,
    failed: me.isError,
  })
  const target = access.state === "redirect" ? access.to : null

  useEffect(() => {
    if (target) router.replace(target)
  }, [target, router])

  return access
}
