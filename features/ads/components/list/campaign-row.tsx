import Link from "next/link"
import { StatusPill } from "@/features/wallet/components/shared/status-pill"
import type { StatusLook } from "@/features/wallet/types"
import { countLabel } from "@/lib/format"
import { promotionPath } from "../../routes"
import type { Campaign } from "../../types"
import {
  campaignHeadline,
  campaignThumb,
  runLine,
  spendLine,
} from "../../utils/campaigns"
import { CampaignThumb } from "./campaign-thumb"

export function CampaignRow({
  campaign,
  status,
}: {
  campaign: Campaign
  status: StatusLook
}) {
  return (
    <Link
      href={promotionPath(campaign.id)}
      className="flex gap-3 border-b border-border px-4 py-3.5 transition-colors hover:bg-accent/40"
    >
      <CampaignThumb url={campaignThumb(campaign.snacc)} />

      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex items-start justify-between gap-3">
          <span className="line-clamp-2 min-w-0 text-sm font-bold text-foreground">
            {campaignHeadline(campaign.snacc)}
          </span>
          <span className="shrink-0">
            <StatusPill label={status.label} tone={status.tone} />
          </span>
        </span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {spendLine(campaign)}
        </span>
        <span className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground tabular-nums">
          <span>{countLabel(campaign.views_count, "view")}</span>
          <span>{countLabel(campaign.clicks_count, "click")}</span>
          <span>{runLine(campaign)}</span>
        </span>
      </span>
    </Link>
  )
}
