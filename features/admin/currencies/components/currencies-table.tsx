"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import Link from "next/link"
import { useMemo, type ReactNode } from "react"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ActionSwitch } from "@/features/admin/shell/components/action-switch"
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
            <ActionSwitch
              checked={currency.enabled}
              disabled={!currency.enabled && currency.missing_settings > 0}
              label={`Switch money on in ${currency.name}`}
              onChange={(enabled) => onSetEnabled(currency.code, enabled)}
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
