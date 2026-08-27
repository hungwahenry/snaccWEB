"use client"

import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { TiersTable } from "@/features/admin/score-tiers/tiers-table"
import {
  useTierMutations,
  useTiers,
} from "@/features/admin/score-tiers/use-score-tiers"

export default function TiersPage() {
  const query = useTiers()
  const mutations = useTierMutations()

  return (
    <>
      <PageHeader
        title="Snacc Score tiers"
        description="The ladder: each rung is a score threshold. Edit names, thresholds, icons and colours here; everyone is re-tiered on save."
      />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t load tiers.
        </p>
      ) : (
        <TiersTable tiers={query.data} mutations={mutations} />
      )}
    </>
  )
}
