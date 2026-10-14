"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useMemo, type ReactNode } from "react"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import type { Column } from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { currencyPath } from "@/features/admin/shell/routes"
import type { AdminCurrency } from "../types"
import { settingsLine } from "../utils/currencies"

export function CurrenciesTable({
  query,
  toolbar,
  onSetEnabled,
}: {
  query: UseQueryResult<AdminCurrency[]>
  toolbar: ReactNode
  onSetEnabled: (code: string, enabled: boolean) => Promise<unknown>
}) {
  const columns = useMemo<Column<AdminCurrency>[]>(
    () => [
      {
        id: "currency",
        header: "Currency",
        cell: (currency) => (
          <div>
            <Link
              href={currencyPath(currency.code)}
              className="font-medium underline-offset-4 hover:underline"
            >
              {currency.name}
            </Link>
            <p className="text-xs text-muted-foreground">{currency.code}</p>
          </div>
        ),
      },
      {
        id: "openIn",
        header: "Open in",
        className: "max-w-xs whitespace-normal",
        cell: (currency) =>
          currency.open_in.length === 0 ? (
            <span className="text-muted-foreground">—</span>
          ) : (
            currency.open_in.join(", ")
          ),
      },
      {
        id: "settings",
        header: "Settings",
        cell: (currency) => settingsLine(currency),
      },
      {
        id: "enabled",
        header: "Money on",
        align: "end",
        className: "w-24",
        cell: (currency) => (
          <CanAct permission="currencies.write">
            <ConfirmAction
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!currency.enabled && currency.missing_settings > 0}
                >
                  {currency.enabled ? "Switch off" : "Switch on"}
                </Button>
              }
              tone={currency.enabled ? "destructive" : "default"}
              title={
                currency.enabled
                  ? `Switch money off in ${currency.name}?`
                  : `Switch money on in ${currency.name}?`
              }
              description={
                currency.enabled
                  ? "Wallets, earnings, withdrawals and Premium by wallet stop for everyone using it. Balances are kept."
                  : "Wallets, earnings and withdrawals open to everyone using it wherever the money features reach."
              }
              confirmLabel={currency.enabled ? "Switch it off" : "Switch it on"}
              onConfirm={() => onSetEnabled(currency.code, !currency.enabled)}
            />
          </CanAct>
        ),
      },
    ],
    [onSetEnabled]
  )

  return (
    <QueryTable
      query={query}
      what="currencies"
      columns={columns}
      rowKey={(currency) => currency.code}
      empty="No currency by that name."
      toolbar={toolbar}
    />
  )
}
