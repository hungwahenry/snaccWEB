"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ClaimForm } from "../hooks/use-claim-referral"
import { CODE_MAX } from "../utils/invite"

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
        <Input
          value={form.value}
          onChange={(event) => form.change(event.target.value)}
          placeholder="K7PQ2MX9"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          maxLength={CODE_MAX}
          aria-label="Invite code"
          className="h-12 flex-1 font-bold tracking-widest"
        />
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
