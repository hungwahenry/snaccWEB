"use client"

import { cloneElement, type ReactElement, type ReactNode } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { can, canForCampus } from "@/lib/permissions"
import { usePermissions } from "../hooks/use-can"

function allowedBy(
  permissions: ReturnType<typeof usePermissions>,
  permission: string,
  campusId: string | null | undefined
): boolean {
  return campusId === undefined
    ? can(permissions, permission)
    : canForCampus(permissions, permission, campusId)
}

/// Renders its children only for someone holding the permission. For a control, prefer CanAct:
/// a disabled button with a reason tells a moderator what to ask for; a missing one tells nobody.
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
  return (
    <>{allowedBy(permissions, permission, campusId) ? children : fallback}</>
  )
}

/// Leaves the control in place but disabled, with a tooltip naming what it would take.
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
  if (allowedBy(permissions, permission, campusId)) return children

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
