import type { NewPromotion } from "../../hooks/use-new-promotion"
import { FORM_SECTIONS } from "../../utils/campaigns"
import { BudgetField, ReachCard } from "./budget-field"
import { FormSection } from "./form-section"
import { ScheduleFields } from "./schedule-fields"

export function BudgetStep({ form }: { form: NewPromotion }) {
  return (
    <>
      <FormSection
        title={FORM_SECTIONS.schedule}
        hint="Nothing runs until Snacc approves it."
        problem={form.problems.schedule}
      >
        <ScheduleFields {...form.schedule} />
      </FormSection>

      <FormSection title={FORM_SECTIONS.budget} problem={form.problems.budget}>
        <BudgetField {...form.budget} />
        <ReachCard {...form.reach} />
      </FormSection>
    </>
  )
}
