"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { EarningsLedger } from "@/features/admin/earnings/earnings-ledger"
import { FundsPanel } from "@/features/admin/earnings/funds-panel"
import { useEarnings, useFundMutations, useFunds } from "@/features/admin/earnings/use-earnings"
import { useUniversities } from "@/features/admin/universities/use-universities"
import type { ListEarningsParams } from "@/features/admin/earnings/types"

export default function EarningsPage() {
  const [params, setParams] = useState<ListEarningsParams>({ page: 1, perPage: 20 })
  const earnings = useEarnings(params)
  const funds = useFunds()
  const universities = useUniversities()
  const fundMutations = useFundMutations()

  function patch(next: Partial<ListEarningsParams>) {
    setParams((prev) => ({ ...prev, ...next }))
  }

  return (
    <>
      <PageHeader title="Earnings" description="Campus funds and the creator earnings ledger." />
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
          <p className="text-muted-foreground text-sm">Couldn&apos;t load campus funds.</p>
        )}

        {earnings.isPending ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : earnings.isError || !earnings.data ? (
          <p className="text-muted-foreground text-sm">Couldn&apos;t load earnings.</p>
        ) : (
          <EarningsLedger data={earnings.data} params={params} onParams={patch} />
        )}
      </div>
    </>
  )
}
