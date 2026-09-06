"use client"

import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { EggsTable } from "@/features/admin/eggs/components/eggs-table"
import { useEggMutations, useEggs } from "@/features/admin/eggs/hooks/use-eggs"

export default function EggsPage() {
  const query = useEggs()
  const mutations = useEggMutations()

  return (
    <>
      <PageHeader
        title="Easter eggs"
        description="Hidden discoveries and what trips them. Trigger specs arm every phone on its next refresh — a new egg here is live without a release."
      />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t load eggs.
        </p>
      ) : (
        <EggsTable eggs={query.data} mutations={mutations} />
      )}
    </>
  )
}
