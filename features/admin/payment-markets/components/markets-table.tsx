"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import {
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import type { MarketChoices } from "../hooks/use-payment-markets-screen"
import type { AdminPaymentMarket, UpsertMarketInput } from "../types"
import { idLine, methodsLine } from "../utils/markets"
import { MarketDialog } from "./market-dialog"

export function MarketsTable({
  query,
  choices,
  onSave,
  onRemove,
}: {
  query: UseQueryResult<AdminPaymentMarket[]>
  choices: MarketChoices
  onSave: (country: string, input: UpsertMarketInput) => Promise<unknown>
  onRemove: (country: string) => Promise<unknown>
}) {
  const columns = useMemo<Column<AdminPaymentMarket>[]>(
    () => [
      {
        id: "country",
        header: "Country",
        cell: (market) => (
          <div>
            <p className="font-medium">{market.country}</p>
            <p className="text-xs text-muted-foreground">
              {market.country_code} · {market.currency} · {market.provider}
            </p>
          </div>
        ),
      },
      {
        id: "methods",
        header: "Does",
        className: "max-w-sm whitespace-normal",
        cell: methodsLine,
      },
      {
        id: "accounts",
        header: "Account digits",
        align: "end",
        className: "tabular-nums",
        cell: (market) => market.account_number_length,
      },
      {
        id: "id",
        header: "ID asked",
        cell: idLine,
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (market) => (
          <div className="flex justify-end gap-2">
            <CanAct permission="payment_markets.write">
              <MarketDialog
                market={market}
                choices={choices}
                trigger={
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                }
                onSubmit={onSave}
              />
            </CanAct>
            <CanAct permission="payment_markets.write">
              <ConfirmAction
                trigger={
                  <Button variant="ghost" size="sm">
                    Remove
                  </Button>
                }
                title={`Remove the ${market.country} market?`}
                description="Top-ups, personal account numbers and sends to banks stop there at once. Balances stay, and money still moves between people on Snacc."
                confirmLabel="Remove market"
                onConfirm={() => onRemove(market.country_code)}
              />
            </CanAct>
          </div>
        ),
      },
    ],
    [choices, onSave, onRemove]
  )

  return (
    <QueryTable
      query={query}
      what="payment markets"
      columns={columns}
      rowKey={(market) => market.country_code}
      empty="No country can reach a bank yet."
    />
  )
}
