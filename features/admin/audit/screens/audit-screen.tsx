"use client"

import { useAuditScreen } from "@/features/admin/audit/hooks/use-audit-screen"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { AuditTable } from "@/features/admin/audit/components/audit-table"

export function AuditScreen() {
  const { params, patch, query } = useAuditScreen()

  return (
    <>
      <PageHeader
        title="Audit log"
        description="Every admin action, with before and after state."
      />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t load the audit log.
        </p>
      ) : (
        <AuditTable data={query.data} params={params} onParams={patch} />
      )}
    </>
  )
}
