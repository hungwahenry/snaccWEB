"use client"

import { MegaphoneIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadFailed } from "@/components/ui/load-failed"
import { BackHeader } from "@/features/navigation/components/back-header"
import { QuotedSnacc } from "@/features/snaccs/components/card/quote/quoted-snacc"
import type { Snacc } from "@/features/snaccs/types"
import { AudienceFields } from "../components/form/audience-fields"
import { BudgetField, ReachCard } from "../components/form/budget-field"
import { ButtonFields } from "../components/form/button-fields"
import { CampaignTimeSheet } from "../components/form/campaign-time-sheet"
import { ChoiceChips } from "../components/form/choice-chips"
import { FormSection } from "../components/form/form-section"
import { NewPromotionSkeleton } from "../components/form/new-promotion-skeleton"
import { PayFooter } from "../components/form/pay-footer"
import { PolicyNote } from "../components/form/policy-note"
import { ScheduleFields } from "../components/form/schedule-fields"
import { PromotionsOff } from "../components/promotions-off"
import { useNewPromotion } from "../hooks/use-new-promotion"
import { useNewPromotionScreen } from "../hooks/use-new-promotion-screen"
import { FORM_SECTIONS } from "../utils/campaigns"

export function NewPromotionScreen({ snaccId }: { snaccId: string | null }) {
  const screen = useNewPromotionScreen(snaccId)

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
      ) : screen.snacc ? (
        <Editor snacc={screen.snacc} />
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

function Editor({ snacc }: { snacc: Snacc }) {
  const form = useNewPromotion(snacc)
  const { problems } = form

  return (
    <>
      <div className="flex flex-col gap-8 px-5 pt-5 pb-10">
        <QuotedSnacc snacc={form.preview} />

        <FormSection
          title={FORM_SECTIONS.audience}
          hint="Leave it all open to reach everyone on Snacc."
          problem={problems.audience}
        >
          <AudienceFields
            campuses={form.campuses}
            regions={form.regions}
            ownerships={form.ownerships}
            genders={form.genders}
            graduation={form.graduation}
            standing={form.standing}
            platforms={form.platforms}
            joined={form.joined}
            hashtags={form.hashtags}
          />
        </FormSection>

        <FormSection
          title={FORM_SECTIONS.placements}
          problem={problems.placements}
        >
          <ChoiceChips {...form.placements} />
        </FormSection>

        <FormSection
          title={FORM_SECTIONS.button}
          hint="Optional. A button under the snacc that opens your link."
          problem={problems.button}
        >
          <ButtonFields {...form.button} />
        </FormSection>

        <FormSection
          title={FORM_SECTIONS.schedule}
          hint="Nothing runs until Snacc approves it."
          problem={problems.schedule}
        >
          <ScheduleFields {...form.schedule} />
        </FormSection>

        <FormSection title={FORM_SECTIONS.budget} problem={problems.budget}>
          <BudgetField {...form.budget} />
          <ReachCard {...form.reach} />
        </FormSection>

        <PolicyNote {...form.policy} />

        <PayFooter {...form.pay} problem={problems.general} />
      </div>

      <CampaignTimeSheet {...form.timeSheet} />
    </>
  )
}
