"use client"

import { useSnaccsScreen } from "@/features/admin/snaccs/hooks/use-snaccs-screen"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { SnaccsTable } from "@/features/admin/snaccs/components/snaccs-table"
import { useSnaccMutations } from "@/features/admin/snaccs/hooks/use-snaccs"

export function SnaccsScreen() {
  const { params, patch, query } = useSnaccsScreen()
  const actions = useSnaccMutations()

  return (
    <>
      <PageHeader
        title="Snaccs"
        description="Review and moderate posted content."
      />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t load snaccs.
        </p>
      ) : (
        <SnaccsTable
          data={query.data}
          params={params}
          onParams={patch}
          actions={actions}
        />
      )}
    </>
  )
}
