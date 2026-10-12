import { Eyebrow } from "@/components/ui/eyebrow"
import type { Campaign } from "../../types"
import { audienceLines, placementsLine } from "../../utils/campaigns"

function SetupLine({ label, lines }: { label: string; lines: string[] }) {
  return (
    <div className="flex flex-col gap-1 px-4 py-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      {lines.map((line) => (
        <span
          key={line}
          className="text-sm font-bold break-words text-foreground"
        >
          {line}
        </span>
      ))}
    </div>
  )
}

export function CampaignSetup({ campaign }: { campaign: Campaign }) {
  return (
    <div className="flex flex-col gap-3">
      <Eyebrow>How it&apos;s set up</Eyebrow>
      <div className="flex flex-col divide-y divide-border/60 rounded-2xl bg-card">
        <SetupLine
          label="Who sees it"
          lines={audienceLines(campaign.audience)}
        />
        <SetupLine
          label="Where it shows"
          lines={[placementsLine(campaign.placements)]}
        />
        <SetupLine
          label="Button"
          lines={
            campaign.button
              ? [campaign.button.label, campaign.button.url]
              : ["No button"]
          }
        />
      </div>
    </div>
  )
}
