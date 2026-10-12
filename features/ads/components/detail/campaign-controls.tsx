import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Spinner } from "@/components/ui/spinner"
import type { PromotionControls } from "../../hooks/use-promotion-controls"
import { ValueRow } from "../form/value-row"

export function CampaignControls({
  budget,
  ends,
  switcher,
  stop,
  againHref,
}: Omit<PromotionControls, "timeSheet" | "topUpSheet">) {
  if (!budget && !ends && !switcher && !stop && !againHref) return null

  return (
    <div className="flex flex-col gap-4">
      <Eyebrow>Manage</Eyebrow>

      {budget || ends ? (
        <div className="flex flex-col gap-2">
          {budget ? (
            <ValueRow
              label={budget.label}
              value={budget.value}
              onPress={budget.onEdit}
            />
          ) : null}
          {ends ? (
            <ValueRow
              label={ends.label}
              value={ends.value}
              onPress={ends.onEdit}
            />
          ) : null}
        </div>
      ) : null}

      {switcher || stop ? (
        <div className="flex gap-3">
          {switcher ? (
            <Button
              variant="outline"
              size="lg"
              className="h-12 flex-1"
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
              className="h-12 flex-1"
              disabled={stop.busy}
              onClick={stop.onPress}
            >
              {stop.busy ? <Spinner /> : "Stop"}
            </Button>
          ) : null}
        </div>
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
