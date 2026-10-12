import type { NewPromotion } from "../../hooks/use-new-promotion"
import { FORM_SECTIONS } from "../../utils/campaigns"
import { ButtonFields } from "./button-fields"
import { ChoiceChips } from "./choice-chips"
import { FormSection } from "./form-section"

export function PlacementStep({ form }: { form: NewPromotion }) {
  return (
    <>
      <FormSection
        title={FORM_SECTIONS.placements}
        problem={form.problems.placements}
      >
        <ChoiceChips {...form.placements} />
      </FormSection>

      <FormSection
        title={FORM_SECTIONS.button}
        hint="Optional. A button under the snacc that opens your link."
        problem={form.problems.button}
      >
        <ButtonFields {...form.button} />
      </FormSection>
    </>
  )
}
