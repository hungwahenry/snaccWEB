"use client"

import { useWithdrawalsScreen } from "@/features/admin/withdrawals/hooks/use-withdrawals-screen"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { WithdrawalsSummary } from "@/features/admin/withdrawals/components/withdrawals-summary"
import { WithdrawalsTable } from "@/features/admin/withdrawals/components/withdrawals-table"

export function WithdrawalsScreen() {
  const { params, patch, query } = useWithdrawalsScreen()

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
