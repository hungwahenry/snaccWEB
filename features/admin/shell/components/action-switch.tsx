"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { usePendingAction } from "../hooks/use-pending-action"

/**
 * A switch that moves the moment it is pressed and settles on what the server saved, or moves
 * back if the save fails.
 */
export function ActionSwitch({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean
  onChange: (next: boolean) => Promise<unknown> | void
  label: string
  disabled?: boolean
}) {
  const [optimistic, setOptimistic] = useState<boolean | null>(null)
  const [pending, run] = usePendingAction(onChange)

  async function toggle(next: boolean) {
    setOptimistic(next)
    await run(next)
    setOptimistic(null)
  }

  return (
    <Switch
      checked={optimistic ?? checked}
      disabled={disabled || pending}
      aria-label={label}
      onCheckedChange={(next) => void toggle(next)}
    />
  )
}
