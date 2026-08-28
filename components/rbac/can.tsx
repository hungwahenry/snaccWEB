"use client"

import { cloneElement, type ReactElement, type ReactNode } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useMe } from "@/features/admin/auth/hooks/use-auth"
import { can, canForCampus, type AdminPermissions } from "@/lib/permissions"

export function usePermissions(): AdminPermissions | undefined {
  return useMe().data?.permissions
}

export function useCan(key: string): boolean {
  return can(usePermissions(), key)
}

export function useCanForCampus(key: string, campusId: string | null): boolean {
  return canForCampus(usePermissions(), key, campusId)
}

export function Can({
  permission,
  campusId,
  children,
  fallback = null,
}: {
  permission: string
  campusId?: string | null
  children: ReactNode
  fallback?: ReactNode
}) {
  const permissions = usePermissions()
  const allowed =
    campusId === undefined
      ? can(permissions, permission)
      : canForCampus(permissions, permission, campusId)

  return <>{allowed ? children : fallback}</>
}

export function CanAct({
  permission,
  campusId,
  children,
}: {
  permission: string
  campusId?: string | null
  children: ReactElement<{ disabled?: boolean }>
}) {
  const permissions = usePermissions()
  const allowed =
    campusId === undefined
      ? can(permissions, permission)
      : canForCampus(permissions, permission, campusId)

  if (allowed) return children

  const reason =
    campusId !== undefined && can(permissions, permission)
      ? "Outside the campuses you moderate."
      : `You need the "${permission}" permission.`

  return (
    <Tooltip>
      <TooltipTrigger
        render={<span className="inline-flex cursor-not-allowed" />}
      >
        <span className="pointer-events-none opacity-50">
          {cloneElement(children, { disabled: true })}
        </span>
      </TooltipTrigger>
      <TooltipContent>{reason}</TooltipContent>
    </Tooltip>
  )
}
