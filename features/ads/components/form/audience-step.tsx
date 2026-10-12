import { QuotedSnacc } from "@/features/snaccs/components/card/quote/quoted-snacc"
import type { NewPromotion } from "../../hooks/use-new-promotion"
import { FORM_SECTIONS } from "../../utils/campaigns"
import { AudienceFields } from "./audience-fields"
import { ReachCard } from "./budget-field"
import { FormSection } from "./form-section"

export function AudienceStep({ form }: { form: NewPromotion }) {
  return (
    <>
      <QuotedSnacc snacc={form.preview} />

      <FormSection
        title={FORM_SECTIONS.audience}
        hint="Leave it all open to reach everyone on Snacc."
        problem={form.problems.audience}
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

      <ReachCard {...form.reach} />
    </>
  )
}
