"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { WithdrawalsSummary } from "@/features/admin/withdrawals/components/withdrawals-summary"
import { WithdrawalsTable } from "@/features/admin/withdrawals/components/withdrawals-table"
import { useWithdrawals } from "@/features/admin/withdrawals/hooks/use-withdrawals"
import type { ListWithdrawalsParams } from "@/features/admin/withdrawals/types"

export default function WithdrawalsPage() {
  const [params, setParams] = useState<ListWithdrawalsParams>({
    page: 1,
    perPage: 20,
  })
  const query = useWithdrawals(params)

  function patch(next: Partial<ListWithdrawalsParams>) {
    setParams((prev) => ({ ...prev, ...next }))
  }

  return (
    <>
      <PageHeader
        title="Withdrawals"
        description="Payouts on their way to a bank, and what has landed."
      />
      <div className="flex flex-col gap-6">
        <WithdrawalsSummary />
        {query.isPending ? (
          <div className="flex justify-center py-24">
            <Spinner />
          </div>
        ) : query.isError || !query.data ? (
          <p className="text-sm text-muted-foreground">
            Couldn&apos;t load withdrawals.
          </p>
        ) : (
          <WithdrawalsTable
            data={query.data}
            params={params}
            onParams={patch}
          />
        )}
      </div>
    </>
  )
}
