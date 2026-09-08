"use client"

import { useEarningsScreen } from "@/features/admin/earnings/hooks/use-earnings-screen"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { EarningsLedger } from "@/features/admin/earnings/components/earnings-ledger"
import { FundsPanel } from "@/features/admin/earnings/components/funds-panel"

export function EarningsScreen() {
  const { params, patch, earnings, funds, universities, fundMutations } =
    useEarningsScreen()

  return (
    <>
      <PageHeader
        title="Earnings"
        description="Campus funds and the creator earnings ledger."
      />
      <div className="flex flex-col gap-6">
        {funds.isPending || universities.isPending ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : funds.data && universities.data ? (
          <FundsPanel
            funds={funds.data}
            universities={universities.data}
            mutations={fundMutations}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            Couldn&apos;t load campus funds.
          </p>
        )}

        {earnings.isPending ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : earnings.isError || !earnings.data ? (
          <p className="text-sm text-muted-foreground">
            Couldn&apos;t load earnings.
          </p>
        ) : (
          <EarningsLedger
            data={earnings.data}
            params={params}
            onParams={patch}
          />
        )}
      </div>
    </>
  )
}
