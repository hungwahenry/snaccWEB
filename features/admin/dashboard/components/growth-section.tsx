import { EmptyNote, Section } from "@/features/admin/shell/components/detail"
import { formatNumber, percent } from "@/lib/format"
import type { GrowthMetrics } from "../types"
import { funnelSteps } from "../utils/dashboard"

export function GrowthSection({
  days,
  growth,
}: {
  days: number
  growth: GrowthMetrics
}) {
  return (
    <Section
      title="New people"
      description={`What the people who signed up in the last ${days} days went on to do.`}
    >
      {growth.signed_up === 0 ? (
        <EmptyNote>Nobody signed up in this period.</EmptyNote>
      ) : (
        <div className="flex flex-col gap-3 rounded-lg border p-4">
          {funnelSteps(growth).map((step) => (
            <div key={step.key} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span className="text-muted-foreground">{step.label}</span>
                <span className="tabular-nums">
                  <span className="font-medium">
                    {formatNumber(step.count)}
                  </span>{" "}
                  <span className="text-muted-foreground">
                    {percent(step.fraction)}
                  </span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded bg-muted">
                <div
                  className="h-full rounded bg-resnacc"
                  style={{ width: percent(step.fraction) }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}
