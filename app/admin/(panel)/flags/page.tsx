"use client"

import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { FlagsTable } from "@/features/admin/feature-flags/flags-table"
import { useFlags, useUpdateFlag } from "@/features/admin/feature-flags/use-flags"

export default function FlagsPage() {
  const query = useFlags()
  const update = useUpdateFlag()

  return (
    <>
      <PageHeader title="Feature flags" description="Turn features on or off across the app." />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-muted-foreground text-sm">Couldn&apos;t load flags.</p>
      ) : (
        <FlagsTable flags={query.data} onToggle={update.mutate} pending={update.isPending} />
      )}
    </>
  )
}
