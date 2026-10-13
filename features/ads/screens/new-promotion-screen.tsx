"use client"

import { MegaphoneIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadFailed } from "@/components/ui/load-failed"
import { useOpenSiteLink } from "@/features/links/hooks/use-open-site-link"
import { BackHeader } from "@/features/navigation/components/back-header"
import { useSnaccActions } from "@/features/snaccs/hooks/use-snacc-actions"
import type { Snacc } from "@/features/snaccs/types"
import type { Campaign } from "../types"
import { AudienceStep } from "../components/form/audience-step"
import { BudgetStep } from "../components/form/budget-step"
import { CampaignTimeSheet } from "../components/form/campaign-time-sheet"
import { NewPromotionSkeleton } from "../components/form/new-promotion-skeleton"
import { PlacementStep } from "../components/form/placement-step"
import { ReviewStep } from "../components/form/review-step"
import { StepButton } from "../components/form/step-button"
import { PromotionsOff } from "../components/promotions-off"
import { useNewPromotion } from "../hooks/use-new-promotion"
import { useNewPromotionScreen } from "../hooks/use-new-promotion-screen"

export function NewPromotionScreen({
  snaccId,
  fromId,
}: {
  snaccId: string | null
  fromId: string | null
}) {
  const screen = useNewPromotionScreen(snaccId, fromId)

  if (screen.snacc && screen.currency && screen.enabled && !screen.loading) {
    return (
      <Editor
        snacc={screen.snacc}
        source={screen.source}
        currency={screen.currency}
        onLeave={screen.onBack}
      />
    )
  }

  return (
    <>
      <BackHeader title="Promote" onBack={screen.onBack} />

      {screen.enabled === false ? (
        <PromotionsOff />
      ) : screen.loading ? (
        <NewPromotionSkeleton />
      ) : screen.failed ? (
        <div className="py-24">
          <LoadFailed
            title="Could not load this snacc"
            onRetry={screen.retry}
          />
        </div>
      ) : (
        <EmptyState
          icon={MegaphoneIcon}
          title="This snacc can't be promoted"
          description="Only your own posts can be promoted, once they're live. Replies and plain resnaccs can't."
          className="py-24"
        />
      )}
    </>
  )
}

function Editor({
  snacc,
  source,
  currency,
  onLeave,
}: {
  snacc: Snacc
  source: Campaign | null
  currency: string
  onLeave: () => void
}) {
  const form = useNewPromotion(snacc, source, currency, onLeave)
  const { handlers } = useSnaccActions()
  const openSiteLink = useOpenSiteLink()

  return (
    <>
      <BackHeader {...form.header} />

      <div className="flex flex-col gap-8 px-5 pt-5 pb-10">
        {form.step === "audience" ? <AudienceStep form={form} /> : null}
        {form.step === "placement" ? <PlacementStep form={form} /> : null}
        {form.step === "budget" ? <BudgetStep form={form} /> : null}
        {form.step === "review" ? (
          <ReviewStep
            form={form}
            handlers={handlers}
            onOpenLink={(card) => {
              if (card.promoted?.button) openSiteLink(card.promoted.button.url)
            }}
          />
        ) : (
          <StepButton {...form.next} />
        )}
      </div>

      <CampaignTimeSheet {...form.timeSheet} />
    </>
  )
}
