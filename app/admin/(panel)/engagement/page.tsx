"use client"

import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { EngagementTable } from "@/features/admin/engagement/engagement-table"
import {
  useEngagement,
  useResetEngagement,
  useUpdateEngagement,
} from "@/features/admin/engagement/use-engagement"

export default function EngagementPage() {
  const query = useEngagement()
  const update = useUpdateEngagement()
  const reset = useResetEngagement()

  return (
    <>
      <PageHeader
        title="Engagement weights"
        description="What each act on a snacc is worth — to the leaderboard, and to the feed. One catalog, so the two can never disagree. Changes apply within ~30s."
      />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-muted-foreground text-sm">Couldn&apos;t load the catalog.</p>
      ) : (
        <EngagementTable
          kinds={query.data}
          onUpdate={update.mutate}
          onReset={reset.mutate}
          pending={update.isPending || reset.isPending}
        />
      )}
    </>
  )
}
