"use client"

import { CakeIcon } from "lucide-react"
import { ActionSheet } from "@/components/ui/action-sheet"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { BirthdayFields, type BirthdayDraft } from "./birthday-fields"

export type BirthdayNudgeSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  birthday: BirthdayDraft
  onChange: (next: BirthdayDraft) => void
  canSave: boolean
  saving: boolean
  onSave: () => void
  onDismiss: () => void
}

export function BirthdayNudgeSheet({
  open,
  onOpenChange,
  birthday,
  onChange,
  canSave,
  saving,
  onSave,
  onDismiss,
}: BirthdayNudgeSheetProps) {
  return (
    <ActionSheet open={open} onOpenChange={onOpenChange} className="px-6 pb-4">
      <div className="flex flex-col items-center gap-2 pt-2">
        <span className="flex size-12 items-center justify-center rounded-full bg-muted">
          <CakeIcon className="size-6 text-foreground" />
        </span>
        <p className="text-center text-xl font-extrabold tracking-tight text-foreground">
          When&apos;s your birthday?
        </p>
        <p className="max-w-xs text-center text-sm leading-5 text-muted-foreground">
          We&apos;ll mark the day and tell the people who follow you. No year,
          and you can only set it once.
        </p>
      </div>

      <div className="py-4">
        <BirthdayFields value={birthday} onChange={onChange} />
      </div>

      <Button
        size="lg"
        className="h-12 text-base"
        disabled={!canSave || saving}
        onClick={onSave}
      >
        {saving ? <Spinner /> : "Save"}
      </Button>
      <button
        type="button"
        onClick={onDismiss}
        className="py-3 text-center text-sm font-medium text-muted-foreground transition-opacity active:opacity-70"
      >
        Not now
      </button>
    </ActionSheet>
  )
}
