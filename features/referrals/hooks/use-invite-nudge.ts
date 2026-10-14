"use client"

import { useState } from "react"
import { useMe } from "@/features/auth/hooks/use-me"
import { useDrawnFace } from "@/features/avatar/hooks/use-drawn-face"
import { useFlag } from "@/features/config/hooks/use-flag"
import { useNudge } from "@/features/nudges/hooks/use-nudge"
import { inviteNote, welcomeLine } from "../utils/invite"
import { useClaimForm } from "./use-claim-referral"
import { useInviter } from "./use-inviter"
import { useReferralOverview } from "./use-referrals"

export function useInviteNudge() {
  const [open, setOpen] = useState(false)
  const enabled = useFlag("referrals")
  const overview = useReferralOverview(enabled)
  const form = useClaimForm("", () => setOpen(false))
  const lookup = useInviter(form.value)
  const me = useMe().data
  const friend = useDrawnFace(`${me?.id ?? "snacc"}-friend`, "c0aede")
  const data = overview.data
  const inviter = lookup.data ?? null

  useNudge("invite_code", data?.can_claim ?? false, () => setOpen(true))

  return {
    open,
    onOpenChange: setOpen,
    form,
    you: me?.profile?.avatar_url ?? null,
    friend: inviter?.avatar_url ?? friend,
    line: data ? welcomeLine(data.reward, data.qualify_days) : "",
    note: inviteNote(inviter, lookup.isError, data?.claim_window_days ?? 0),
  }
}
