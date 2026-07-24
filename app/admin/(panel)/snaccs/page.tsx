"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { SnaccsTable } from "@/features/admin/snaccs/snaccs-table"
import { useSnaccMutations, useSnaccs } from "@/features/admin/snaccs/use-snaccs"
import type { ListSnaccsParams } from "@/features/admin/snaccs/types"

export default function SnaccsPage() {
  const [params, setParams] = useState<ListSnaccsParams>({ page: 1, perPage: 20 })
  const query = useSnaccs(params)
  const actions = useSnaccMutations()

  function patch(next: Partial<ListSnaccsParams>) {
    setParams((prev) => ({ ...prev, ...next }))
  }

  return (
    <>
      <PageHeader title="Snaccs" description="Review and moderate posted content." />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-muted-foreground text-sm">Couldn&apos;t load snaccs.</p>
      ) : (
        <SnaccsTable data={query.data} params={params} onParams={patch} actions={actions} />
      )}
    </>
  )
}
