"use client"

import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { BadgesTable } from "@/features/admin/badges/badges-table"
import { useBadgeMutations, useBadges } from "@/features/admin/badges/use-badges"

export default function BadgesPage() {
  const query = useBadges()
  const mutations = useBadgeMutations()

  return (
    <>
      <PageHeader
        title="Badges"
        description="Badges you hand out by name. Grant one from a user's page."
      />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-muted-foreground text-sm">Couldn&apos;t load badges.</p>
      ) : (
        <BadgesTable badges={query.data} mutations={mutations} />
      )}
    </>
  )
}
