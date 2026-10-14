"use client"

import { useMemo } from "react"
import { groupPermissions } from "@/features/admin/roles/utils/roles"
import { useMe } from "@/features/auth/hooks/use-me"
import { useOwnAccess } from "./use-own-access"

export function useProfileScreen() {
  const me = useMe()
  const access = useOwnAccess()

  const groups = useMemo(
    () => groupPermissions(access.data?.permissions ?? []),
    [access.data]
  )

  return { me, access, groups }
}
