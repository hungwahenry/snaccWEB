import { Badge } from "@/components/ui/badge"
import { BarRow } from "@/features/admin/shell/components/bar-row"
import { EmptyNote, Section } from "@/features/admin/shell/components/detail"
import { formatDate } from "@/lib/format"
import type { ReportScan } from "../types"
import { scoredCategories } from "../utils/reports"

export function ScanPanel({ scan }: { scan: ReportScan }) {
  const scored = scoredCategories(scan)

  return (
    <Section
      title="What the automatic check saw"
      description={`${scan.model}, ${formatDate(scan.created_at)}.`}
      action={
        scan.applied === scan.verdict ? (
          <Badge>{scan.applied}</Badge>
        ) : (
          <Badge variant="outline">{scan.verdict}, not enforced</Badge>
        )
      }
    >
      {scored.length === 0 ? (
        <EmptyNote>Nothing scored above zero.</EmptyNote>
      ) : (
        <div className="flex flex-col gap-1.5 rounded-lg border p-4">
          {scored.map(([category, score]) => (
            <BarRow
              key={category}
              label={category}
              value={score.toFixed(4)}
              fraction={score}
              highlighted={category === scan.category}
            />
          ))}
        </div>
      )}
    </Section>
  )
}
