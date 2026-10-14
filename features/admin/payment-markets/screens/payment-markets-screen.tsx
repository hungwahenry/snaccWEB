"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { MarketDialog } from "../components/market-dialog"
import { MarketsTable } from "../components/markets-table"
import { usePaymentMarketsScreen } from "../hooks/use-payment-markets-screen"

export function PaymentMarketsScreen() {
  const { query, actions, choices } = usePaymentMarketsScreen()

  return (
    <>
      <PageHeader
        title="Payment markets"
        description="Where money can reach a bank, and through which provider. A country without a market still moves money between people on Snacc, but cannot top up or send to a bank."
        action={
          <CanAct permission="payment_markets.write">
            <MarketDialog
              choices={choices}
              trigger={
                <Button size="sm">
                  <Plus />
                  Add market
                </Button>
              }
              onSubmit={actions.save}
            />
          </CanAct>
        }
      />
      <MarketsTable
        query={query}
        choices={choices}
        onSave={actions.save}
        onRemove={actions.remove}
      />
    </>
  )
}
