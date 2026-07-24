"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { AuditTable } from "@/features/admin/audit/audit-table"
import { useAuditLogs } from "@/features/admin/audit/use-audit"
import type { ListAuditParams } from "@/features/admin/audit/types"

export default function AuditPage() {
  const [params, setParams] = useState<ListAuditParams>({ page: 1, perPage: 30 })
  const query = useAuditLogs(params)

  function patch(next: Partial<ListAuditParams>) {
    setParams((prev) => ({ ...prev, ...next }))
  }

  return (
    <>
      <PageHeader title="Audit log" description="Every admin action, with before and after state." />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-muted-foreground text-sm">Couldn&apos;t load the audit log.</p>
      ) : (
        <AuditTable data={query.data} params={params} onParams={patch} />
      )}
    </>
  )
}
