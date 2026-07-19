"use client"

import Link from "next/link"
import { use } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { WithdrawalDetail } from "@/features/withdrawals/withdrawal-detail"
import { useWithdrawal, useWithdrawalMutations } from "@/features/withdrawals/use-withdrawals"

export default function WithdrawalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const query = useWithdrawal(id)
  const actions = useWithdrawalMutations(id)

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 w-fit"
        render={<Link href="/admin/withdrawals" />}
      >
        ← Back to withdrawals
      </Button>
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-muted-foreground text-sm">Couldn&apos;t load this withdrawal.</p>
      ) : (
        <WithdrawalDetail withdrawal={query.data} actions={actions} />
      )}
    </>
  )
}
