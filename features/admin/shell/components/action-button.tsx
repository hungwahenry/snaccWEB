"use client"

import type { ComponentProps } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { usePendingAction } from "../hooks/use-pending-action"

/** A button for an action that needs no confirmation, showing its own progress while it runs. */
export function ActionButton({
  onClick,
  disabled,
  children,
  ...props
}: Omit<ComponentProps<typeof Button>, "onClick"> & {
  onClick: () => Promise<unknown> | void
}) {
  const [pending, run] = usePendingAction(onClick)

  return (
    <Button
      {...props}
      disabled={disabled || pending}
      onClick={() => void run()}
    >
      {pending ? <Spinner /> : null}
      {children}
    </Button>
  )
}
