"use client"

import { Button } from "@/components/ui/button"
import type { ClaimForm } from "../hooks/use-claim-referral"
import { InviteCodeInput } from "./invite-code-input"

export function ClaimCodeForm({
  form,
  hint,
}: {
  form: ClaimForm
  hint: string
}) {
  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        form.submit()
      }}
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-extrabold text-foreground">Got a code?</h2>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </div>

      <div className="flex gap-3">
        <InviteCodeInput form={form} className="flex-1" />
        <Button
          type="submit"
          size="lg"
          className="h-12 px-6"
          disabled={!form.ready}
        >
          {form.busy ? "Applying…" : "Apply"}
        </Button>
      </div>
    </form>
  )
}
