import type { AudienceMetrics } from "../types"
import {
  AudienceSection,
  PlatformsSection,
  PushReachSection,
  RetentionSection,
} from "./audience-sections"

export function AudienceTab({ audience }: { audience: AudienceMetrics }) {
  return (
    <div className="flex flex-col gap-6">
      <AudienceSection audience={audience} />
      <RetentionSection cohorts={audience.retention} />
      <div className="grid gap-6 lg:grid-cols-2">
        <PlatformsSection platforms={audience.platforms} />
        <PushReachSection push={audience.push} />
      </div>
    </div>
  )
}
