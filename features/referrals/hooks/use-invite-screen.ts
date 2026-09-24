"use client"

import { useSearchParams } from "next/navigation"
import { useFlagWhenKnown } from "@/features/config/hooks/use-flag"
import { useBack } from "@/hooks/use-back"
import { formatNaira } from "@/lib/format"
import { bareLink, copyLink, shareOrCopy } from "@/lib/share-links"
import { inviteMessage, rewardBlurb } from "../utils/invite"
import { useClaimForm } from "./use-claim-referral"
import { useInvitees, useReferralOverview } from "./use-referrals"

export function useInviteScreen() {
  const onBack = useBack()
  const enabled = useFlagWhenKnown("referrals")
  const fromLink = useSearchParams().get("code") ?? ""
  const overview = useReferralOverview()
  const invitees = useInvitees()
  const claim = useClaimForm(fromLink)
  const data = overview.data

  return {
    onBack,
    enabled,
    loading: overview.isLoading,
    failed: overview.isError && !data,
    retry: () => void overview.refetch(),
    list: invitees,
    panel: data
      ? {
          code: data.code,
          shownLink: bareLink(data.link),
          blurb: rewardBlurb(data.reward, data.qualify_days),
          stats: {
            invited: String(data.stats.invited),
            paid: String(data.stats.paid),
            earned: formatNaira(data.stats.earned_kobo),
          },
          referredBy: data.referred_by,
          claim: data.can_claim
            ? {
                form: claim,
                hint: `Joined with a friend’s code? Enter it within ${data.claim_window_days} days of signing up.`,
              }
            : null,
          onCopy: () => void copyLink(data.link, "Your invite link"),
          onShare: () =>
            void shareOrCopy(
              data.link,
              inviteMessage(data.code),
              "Your invite link"
            ),
        }
      : null,
  }
}

export type InvitePanelModel = NonNullable<
  ReturnType<typeof useInviteScreen>["panel"]
>
