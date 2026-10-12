import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Spinner } from "@/components/ui/spinner"
import type { PromotionControls } from "../../hooks/use-promotion-controls"
import { BudgetField } from "../form/budget-field"
import { FormField } from "../form/form-section"
import { TimeRow } from "../form/schedule-fields"

export function CampaignControls({
  ends,
  topUp,
  switcher,
  stop,
  againHref,
}: Omit<PromotionControls, "timeSheet">) {
  if (!ends && !topUp && !switcher && !stop && !againHref) return null

  return (
    <div className="flex flex-col gap-4">
      <Eyebrow>Manage</Eyebrow>

      {ends ? (
        <TimeRow label={ends.label} value={ends.value} onPress={ends.onEdit} />
      ) : null}

      {topUp ? (
        <FormField label="Add to the budget">
          <BudgetField
            value={topUp.value}
            hint={topUp.hint}
            onChange={topUp.onChange}
          />
          {topUp.problem ? (
            <p role="alert" className="px-1 text-sm text-destructive">
              {topUp.problem}
            </p>
          ) : null}
          <Button
            variant="outline"
            size="lg"
            className="h-12 w-full"
            disabled={!topUp.ready || topUp.adding}
            onClick={topUp.onAdd}
          >
            {topUp.adding ? <Spinner /> : topUp.label}
          </Button>
        </FormField>
      ) : null}

      {switcher ? (
        <Button
          variant="outline"
          size="lg"
          className="h-12 w-full"
          disabled={switcher.busy}
          onClick={switcher.onPress}
        >
          {switcher.busy ? <Spinner /> : switcher.label}
        </Button>
      ) : null}

      {stop ? (
        <Button
          variant="destructive"
          size="lg"
          className="h-12 w-full"
          disabled={stop.busy}
          onClick={stop.onPress}
        >
          {stop.busy ? <Spinner /> : "Stop promotion"}
        </Button>
      ) : null}

      {againHref ? (
        <Button
          size="lg"
          className="h-12 w-full"
          render={<Link href={againHref} />}
        >
          Promote again
        </Button>
      ) : null}
    </div>
  )
}
