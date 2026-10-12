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
        hint="Leave the rest open to reach everyone in that country."
        problem={form.problems.audience}
      >
        <AudienceFields
          country={form.country}
          campuses={form.campuses}
          regions={form.regions}
          campusTypes={form.campusTypes}
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
