import { EmptyNote, Section } from "@/features/admin/shell/components/detail"
import { formatNumber, percent, shortDay } from "@/lib/format"
import type { Cohort } from "../types"
import { RETENTION_WEEKS, retentionRows } from "../utils/dashboard"

const WEEKS = Array.from({ length: RETENTION_WEEKS }, (_, index) => index)

export function RetentionSection({ cohorts }: { cohorts: Cohort[] }) {
  return (
    <Section
      title="Who keeps coming back"
      description="Each row is the people who signed up that week. Each column is the share of them who were active that many weeks later."
    >
      {cohorts.length === 0 ? (
        <EmptyNote>Nobody signed up in the last 12 weeks.</EmptyNote>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[640px] border-collapse text-xs tabular-nums">
            <thead>
              <tr className="text-muted-foreground">
                <th className="px-3 py-2 text-left font-medium">Signed up</th>
                <th className="px-3 py-2 text-right font-medium">People</th>
                {WEEKS.map((week) => (
                  <th key={week} className="px-1 py-2 text-center font-medium">
                    {week === 0 ? "Same week" : `+${week}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {retentionRows(cohorts).map((row) => (
                <tr key={row.week} className="border-t">
                  <td className="px-3 py-1.5 whitespace-nowrap">
                    Week of {shortDay(row.week)}
                  </td>
                  <td className="px-3 py-1.5 text-right">
                    {formatNumber(row.size)}
                  </td>
                  {row.cells.map((cell, index) => (
                    <td key={index} className="p-0.5">
                      {cell ? (
                        <div
                          className="rounded px-1 py-1.5 text-center"
                          style={{
                            backgroundColor: `color-mix(in oklch, var(--resnacc) ${Math.round(cell.fraction * 80)}%, transparent)`,
                          }}
                          title={`${formatNumber(cell.users)} people`}
                        >
                          {percent(cell.fraction)}
                        </div>
                      ) : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  )
}
