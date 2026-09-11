"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { BarRow } from "@/features/admin/shell/components/bar-row"
import {
  EmptyNote,
  Fact,
  Facts,
} from "@/features/admin/shell/components/detail"
import {
  LoadingBlock,
  QueryView,
} from "@/features/admin/shell/components/query-view"
import { formatNumber } from "@/lib/format"
import type { CategoryInsight, ModerationRule } from "../types"
import { catches, insightBars } from "../utils/insight"

function Spread({
  insight,
  rule,
}: {
  insight: CategoryInsight
  rule: ModerationRule | null
}) {
  if (insight.scans === 0) {
    return (
      <EmptyNote>
        Nothing scored on this surface yet. Leave the pipeline running with
        enforcement off and the shape of this category will fill in.
      </EmptyNote>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        {formatNumber(insight.scans)} reviews scored for this category. The rule
        currently fires at {rule?.threshold.toFixed(2)}.
      </p>

      <div className="flex flex-col gap-1">
        {insightBars(insight, rule?.threshold ?? null).map((bar) => (
          <BarRow
            key={bar.from}
            label={bar.label}
            value={formatNumber(bar.count)}
            fraction={bar.fraction}
            highlighted={bar.catching}
          />
        ))}
      </div>

      <Facts>
        {catches(insight).map((row) => (
          <Fact
            key={row.threshold}
            label={`At ${row.threshold.toFixed(1)}`}
            value={`${formatNumber(row.count)} caught`}
          />
        ))}
      </Facts>
    </div>
  )
}

export function TuneSheet({
  rule,
  insight,
  onClose,
}: {
  rule: ModerationRule | null
  insight: UseQueryResult<CategoryInsight>
  onClose: () => void
}) {
  return (
    <Dialog open={rule !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {rule ? `${rule.category} on ${rule.surface}` : "Tune"}
          </DialogTitle>
        </DialogHeader>

        <QueryView
          query={insight}
          what="the score spread"
          loading={<LoadingBlock className="py-12" />}
        >
          {(data) => <Spread insight={data} rule={rule} />}
        </QueryView>

        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Close</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
