"use client"

import { can, canForCampus, type AdminPermissions } from "@/lib/permissions"
import { useMe } from "@/features/auth/hooks/use-me"

export function usePermissions(): AdminPermissions | undefined {
  return useMe().data?.permissions
}

export function useCan(key: string): boolean {
  return can(usePermissions(), key)
}

export function useCanForCampus(key: string, campusId: string | null): boolean {
  return canForCampus(usePermissions(), key, campusId)
}
