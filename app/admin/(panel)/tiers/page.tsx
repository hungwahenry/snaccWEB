"use client"

import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { TiersTable } from "@/features/admin/leaderboard-tiers/tiers-table"
import { useTierMutations, useTiers } from "@/features/admin/leaderboard-tiers/use-leaderboard-tiers"

export default function TiersPage() {
  const query = useTiers()
  const mutations = useTierMutations()

  return (
    <>
      <PageHeader
        title="Leaderboard tiers"
        description="Campus-percentile cutoffs that decide each rank tier."
      />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-muted-foreground text-sm">Couldn&apos;t load tiers.</p>
      ) : (
        <TiersTable tiers={query.data} mutations={mutations} />
      )}
    </>
  )
}
