"use client"

import { DetailScreen } from "@/features/admin/shell/ui/detail-screen"
import { WithdrawalDetail } from "@/features/admin/withdrawals/components/withdrawal-detail"
import {
  useWithdrawal,
  useWithdrawalMutations,
} from "@/features/admin/withdrawals/hooks/use-withdrawals"

export function WithdrawalDetailScreen({ id }: { id: string }) {
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
