"use client"

import { HandshakeIcon } from "lucide-react"
import { ActionSheet } from "@/components/ui/action-sheet"
import { Button } from "@/components/ui/button"
import { FacePair } from "@/features/avatar/components/face-pair"
import { cn } from "@/lib/utils"
import type { ClaimForm } from "../hooks/use-claim-referral"
import type { InviteNoteTone } from "../utils/invite"
import { InviteCodeInput } from "./invite-code-input"

const NOTE_TONE: Record<InviteNoteTone, string> = {
  quiet: "text-muted-foreground",
  found: "font-semibold text-foreground",
  missing: "text-destructive",
}

export function InviteNudgeSheet({
  open,
  onOpenChange,
  form,
  you,
  friend,
  line,
  note,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: ClaimForm
  you: string | null
  friend: string | null
  line: string
  note: { text: string; tone: InviteNoteTone }
}) {
  return (
    <ActionSheet
      open={open}
      onOpenChange={onOpenChange}
      label="Did a friend invite you?"
      className="flex flex-col items-center gap-5 px-6 pt-4 pb-4"
      footer={
        <Button
          size="lg"
          className="h-12 w-full"
          disabled={!form.ready}
          onClick={form.submit}
        >
          {form.busy ? "Applying…" : "Apply"}
        </Button>
      }
    >
      <FacePair
        left={you}
        right={friend}
        badge={<HandshakeIcon className="size-6 text-foreground" />}
      />

      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
          Did a friend invite you?
        </h2>
        <p className="text-base leading-6 text-muted-foreground">{line}</p>
      </div>

      <form
        className="flex w-full flex-col gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          form.submit()
        }}
      >
        <InviteCodeInput form={form} className="text-center text-xl" />
        <p className={cn("text-center text-sm", NOTE_TONE[note.tone])}>
          {note.text}
        </p>
      </form>
    </ActionSheet>
  )
}
