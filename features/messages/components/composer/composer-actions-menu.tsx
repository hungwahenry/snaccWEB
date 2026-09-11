"use client"

import { PlusIcon } from "lucide-react"
import { useState } from "react"
import { ActionSheet, ActionSheetChoice } from "@/components/ui/action-sheet"
import type { ComposerAction } from "../../types"

export function ComposerActionsMenu({
  actions,
}: {
  actions: ComposerAction[]
}) {
  const [open, setOpen] = useState(false)
  // A menu of one is a detour: the button becomes that action.
  const only = actions.length === 1 ? actions[0] : null
  const Glyph = only?.icon ?? PlusIcon

  function select(action: ComposerAction) {
    setOpen(false)
    action.onPress()
  }

  return (
    <>
      <button
        type="button"
        onClick={() => (only ? only.onPress() : setOpen(true))}
        aria-label={only?.label ?? "Add to message"}
        className="flex size-14 shrink-0 items-center justify-center rounded-full bg-input text-foreground transition-colors hover:bg-accent active:opacity-60"
      >
        <Glyph className="size-6" />
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
