"use client"

import { PlusIcon, type LucideIcon } from "lucide-react"
import { useState } from "react"
import { ActionSheet, ActionSheetChoice } from "@/components/ui/action-sheet"

export interface ComposerAction {
  key: string
  icon: LucideIcon
  label: string
  hint: string
  onPress: () => void
}

export function ComposerActionsMenu({
  actions,
}: {
  actions: ComposerAction[]
}) {
  const [open, setOpen] = useState(false)

  function select(action: ComposerAction) {
    setOpen(false)
    action.onPress()
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Add to message"
        className="flex size-14 shrink-0 items-center justify-center rounded-full bg-input text-foreground transition-colors hover:bg-accent active:opacity-60"
      >
        <PlusIcon className="size-6" />
      </button>

      <ActionSheet open={open} onOpenChange={setOpen} title="Add to message">
        {actions.map((action) => (
          <ActionSheetChoice
            key={action.key}
            icon={action.icon}
            label={action.label}
            hint={action.hint}
            onPress={() => select(action)}
          />
        ))}
      </ActionSheet>
    </>
  )
}
