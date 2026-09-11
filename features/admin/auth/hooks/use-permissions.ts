"use client"

import { useMe } from "@/features/auth/hooks/use-me"
import type { AdminPermissions } from "@/lib/permissions"

/** What the signed-in admin may do. Undefined until their account has loaded. */
export function usePermissions(): AdminPermissions | undefined {
  return useMe().data?.permissions
}
