"use client"

import { cloneElement, type ReactElement } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { usePermissions } from "../hooks/use-permissions"
import { denialReason } from "../utils/permission"

/**
 * Leaves a control in place but disabled for someone without the permission, with a tooltip
 * naming what it takes: a disabled button tells a moderator what to ask for, a missing one
 * tells nobody. The API enforces the same permission either way.
 */
export function CanAct({
  permission,
  children,
}: {
  permission: string
  children: ReactElement<{ disabled?: boolean }>
}) {
  const reason = denialReason(usePermissions(), permission)
  if (reason === null) return children

  return (
    <Tooltip>
      <TooltipTrigger
        render={<span className="inline-flex cursor-not-allowed" />}
      >
        <span className="pointer-events-none inline-flex">
          {cloneElement(children, { disabled: true })}
        </span>
      </TooltipTrigger>
      <TooltipContent>{reason}</TooltipContent>
    </Tooltip>
  )
}
