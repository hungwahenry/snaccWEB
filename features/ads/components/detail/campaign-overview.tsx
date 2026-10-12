import { StatusPill } from "@/features/wallet/components/shared/status-pill"
import type { StatusLook } from "@/features/wallet/types"
import type { Campaign } from "../../types"
import { runLine, spendLine, spentPercent } from "../../utils/campaigns"

export function CampaignOverview({
  campaign,
  status,
  note,
}: {
  campaign: Campaign
  status: StatusLook
  note: string
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <StatusPill label={status.label} tone={status.tone} />
        <span className="truncate text-xs text-muted-foreground tabular-nums">
          {runLine(campaign)}
        </span>
      </div>

      <p className="text-sm leading-5 text-pretty text-foreground">{note}</p>

      <div className="flex flex-col gap-2">
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${spentPercent(campaign)}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">
          {spendLine(campaign)}
        </span>
      </div>
    </div>
  )
}
