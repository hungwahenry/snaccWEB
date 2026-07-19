"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { WithdrawalsTable } from "@/features/withdrawals/withdrawals-table"
import { useWithdrawals } from "@/features/withdrawals/use-withdrawals"
import type { ListWithdrawalsParams } from "@/features/withdrawals/types"

export default function WithdrawalsPage() {
  const [params, setParams] = useState<ListWithdrawalsParams>({ page: 1, perPage: 20 })
  const query = useWithdrawals(params)

  function patch(next: Partial<ListWithdrawalsParams>) {
    setParams((prev) => ({ ...prev, ...next }))
  }

  return (
    <>
      <PageHeader title="Withdrawals" description="Review and settle creator payouts." />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-muted-foreground text-sm">Couldn&apos;t load withdrawals.</p>
      ) : (
        <WithdrawalsTable data={query.data} params={params} onParams={patch} />
      )}
    </>
  )
}
