"use client"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { ClaimForm } from "../hooks/use-claim-referral"
import { CODE_MAX } from "../utils/invite"

export function InviteCodeInput({
  form,
  className,
}: {
  form: ClaimForm
  className?: string
}) {
  return (
    <Input
      value={form.value}
      onChange={(event) => form.change(event.target.value)}
      placeholder="K7PQ2MX9"
      autoCapitalize="characters"
      autoCorrect="off"
      spellCheck={false}
      maxLength={CODE_MAX}
      aria-label="Invite code"
      className={cn("h-12 font-bold tracking-widest", className)}
    />
  )
}
