"use client"

import { Section } from "@/components/admin/detail"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/format"
import type { ReportScan } from "../types"

export function ScanPanel({ scan }: { scan: ReportScan }) {
  const scored = Object.entries(scan.scores)
    .sort(([, a], [, b]) => b - a)
    .filter(([, score]) => score > 0)

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
        <p className="rounded-lg border border-dashed py-6 text-center text-sm text-muted-foreground">
          Nothing scored above zero.
        </p>
      ) : (
        <div className="flex flex-col gap-1.5 rounded-lg border p-4">
          {scored.map(([category, score]) => {
            const fired = category === scan.category

            return (
              <div key={category} className="flex items-center gap-3">
                <span
                  className={`w-52 shrink-0 truncate font-mono text-xs ${fired ? "font-semibold" : "text-muted-foreground"}`}
                >
                  {category}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded bg-muted">
                  <div
                    className={
                      fired
                        ? "h-full bg-destructive"
                        : "h-full bg-foreground/30"
                    }
                    style={{ width: `${Math.round(score * 100)}%` }}
                  />
                </div>
                <span className="w-16 text-right font-mono text-xs tabular-nums">
                  {score.toFixed(4)}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </Section>
  )
}
