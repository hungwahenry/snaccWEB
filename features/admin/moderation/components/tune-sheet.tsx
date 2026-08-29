"use client"

import { Fact, Facts } from "@/components/admin/detail"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { formatNumber } from "@/lib/format"
import { useInsight } from "../hooks/use-moderation"
import type { ModerationRule } from "../types"

export function TuneSheet({
  rule,
  onClose,
}: {
  rule: ModerationRule | null
  onClose: () => void
}) {
  const insight = useInsight(rule?.surface ?? null, rule?.category ?? null)
  const data = insight.data
  const peak = Math.max(1, ...(data?.buckets ?? []).map((b) => b.count))

  return (
    <Dialog open={rule !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {rule ? `${rule.category} on ${rule.surface}` : "Tune"}
          </DialogTitle>
        </DialogHeader>

        {insight.isPending ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : !data || data.scans === 0 ? (
          <p className="rounded-lg border border-dashed py-10 text-center text-sm text-pretty text-muted-foreground">
            Nothing scored on this surface yet. Leave the pipeline running with
            enforcement off and the shape of this category will fill in.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              {formatNumber(data.scans)} reviews scored for this category. The
              rule currently fires at {rule?.threshold.toFixed(2)}.
            </p>

            <div className="flex flex-col gap-1">
              {data.buckets.map((bucket) => {
                const catching = rule !== null && bucket.from >= rule.threshold

                return (
                  <div key={bucket.from} className="flex items-center gap-3">
                    <span className="w-20 text-right font-mono text-xs text-muted-foreground tabular-nums">
                      {bucket.from.toFixed(1)}–{(bucket.from + 0.1).toFixed(1)}
                    </span>
                    <div className="h-4 flex-1 overflow-hidden rounded bg-muted">
                      <div
                        className={
                          catching
                            ? "h-full bg-destructive"
                            : "h-full bg-foreground/40"
                        }
                        style={{
                          width: `${Math.round((bucket.count / peak) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="w-14 text-right text-xs tabular-nums">
                      {formatNumber(bucket.count)}
                    </span>
                  </div>
                )
              })}
            </div>

            <Facts>
              {data.wouldCatch
                .filter((row) => row.count > 0)
                .map((row) => (
                  <Fact
                    key={row.threshold}
                    label={`At ${row.threshold.toFixed(1)}`}
                    value={`${formatNumber(row.count)} caught`}
                  />
                ))}
            </Facts>
          </div>
        )}

        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Close</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
