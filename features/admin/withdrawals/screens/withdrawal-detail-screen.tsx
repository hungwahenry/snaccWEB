"use client"

import { BackLink } from "@/features/admin/shell/components/back-link"
import { QueryView } from "@/features/admin/shell/components/query-view"
import { WITHDRAWALS_PATH } from "@/features/admin/shell/routes"
import { WithdrawalDetail } from "../components/withdrawal-detail"
import { useWithdrawalDetailScreen } from "../hooks/use-withdrawal-detail-screen"

export function WithdrawalDetailScreen({ id }: { id: string }) {
  const { query, actions } = useWithdrawalDetailScreen(id)

  return (
    <>
      <BackLink href={WITHDRAWALS_PATH} label="Back to withdrawals" />
      <QueryView query={query} what="this withdrawal">
        {(withdrawal) => (
          <WithdrawalDetail withdrawal={withdrawal} onRetry={actions.retry} />
        )}
      </QueryView>
    </>
  )
}
