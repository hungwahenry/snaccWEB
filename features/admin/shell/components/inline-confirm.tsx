"use client"

import { useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { ActionButton } from "./action-button"

export function InlineConfirm({
  trigger,
  question,
  confirmLabel,
  onConfirm,
}: {
  trigger: (ask: () => void) => ReactNode
  question: string
  confirmLabel: string
  onConfirm: () => Promise<unknown>
}) {
  const [asking, setAsking] = useState(false)

  if (!asking) return trigger(() => setAsking(true))

  return (
    <span className="inline-flex flex-wrap items-center gap-2 text-sm">
      <span>{question}</span>
      <ActionButton
        size="sm"
        variant="destructive"
        onClick={async () => {
          await onConfirm()
          setAsking(false)
        }}
      >
        {confirmLabel}
      </ActionButton>
      <Button size="sm" variant="ghost" onClick={() => setAsking(false)}>
        Cancel
      </Button>
    </span>
  )
}
