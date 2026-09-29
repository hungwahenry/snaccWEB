import { BarRow } from "@/features/admin/shell/components/bar-row"
import {
  EmptyNote,
  Fact,
  Facts,
  Section,
} from "@/features/admin/shell/components/detail"
import { formatNumber, percent } from "@/lib/format"
import type { PlatformMix, PushReach } from "../types"
import {
  knownVersions,
  platformLabel,
  share,
  versionLabel,
} from "../utils/dashboard"

export function PlatformsSection({ platforms }: { platforms: PlatformMix[] }) {
  const total = platforms.reduce((sum, row) => sum + row.users, 0)

  return (
    <Section
      title="Apps in use"
      description="The app each person last opened in the past 30 days."
    >
      {platforms.length === 0 ? (
        <EmptyNote>Nobody has opened the app lately.</EmptyNote>
      ) : (
        <div className="flex flex-col gap-4 rounded-lg border p-4">
          {platforms.map((platform) => (
            <div key={platform.platform} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span className="font-medium">
                  {platformLabel(platform.platform)}
                </span>
                <span className="text-muted-foreground tabular-nums">
                  {formatNumber(platform.users)} ·{" "}
                  {percent(share(platform.users, total))}
                </span>
              </div>
              {knownVersions(platform).map((row) => (
                <BarRow
                  key={row.version}
                  label={versionLabel(row.version)}
                  value={formatNumber(row.users)}
                  fraction={share(row.users, platform.users)}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}

export function PushReachSection({ push }: { push: PushReach[] }) {
  return (
    <Section
      title="Push reach"
      description="People with notifications on, by device."
    >
      {push.length === 0 ? (
        <EmptyNote>No devices have notifications on.</EmptyNote>
      ) : (
        <Facts>
          {push.map((row) => (
            <Fact
              key={row.platform}
              label={platformLabel(row.platform)}
              value={formatNumber(row.users)}
            />
          ))}
        </Facts>
      )}
    </Section>
  )
}
