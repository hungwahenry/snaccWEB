"use client"

import { use } from "react"
import { DetailScreen } from "@/components/admin/detail-screen"
import { WithdrawalDetail } from "@/features/admin/withdrawals/withdrawal-detail"
import {
  useWithdrawal,
  useWithdrawalMutations,
} from "@/features/admin/withdrawals/use-withdrawals"

export default function WithdrawalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const query = useWithdrawal(id)
  const actions = useWithdrawalMutations(id)

  return (
    <DetailScreen
      backHref="/admin/withdrawals"
      backLabel="Back to withdrawals"
      missing="Couldn't load this withdrawal."
      query={query}
    >
      {(withdrawal) => (
        <WithdrawalDetail withdrawal={withdrawal} actions={actions} />
      )}
    </DetailScreen>
  )
}
