"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import {
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { formatMoney } from "@/lib/money"
import type { CurrencySetting } from "../types"
import { AmountDialog } from "./amount-dialog"

export function CurrencySettingsTable({
  code,
  query,
  onSave,
}: {
  code: string
  query: UseQueryResult<CurrencySetting[]>
  onSave: (key: string, amount: number) => Promise<unknown>
}) {
  const columns = useMemo<Column<CurrencySetting>[]>(
    () => [
      {
        id: "setting",
        header: "Setting",
        className: "max-w-md whitespace-normal",
        cell: (setting) => (
          <div className="min-w-0">
            <p className="font-mono text-xs">{setting.key}</p>
            <p className="mt-1 text-xs text-pretty text-muted-foreground">
              {setting.description}
            </p>
          </div>
        ),
      },
      {
        id: "amount",
        header: "Amount",
        align: "end",
        className: "tabular-nums",
        cell: (setting) =>
          setting.amount ? (
            formatMoney(setting.amount)
          ) : (
            <span className="text-xs text-destructive italic">Not set</span>
          ),
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (setting) => (
          <CanAct permission="currencies.write">
            <AmountDialog
              title={
                <>
                  Edit <span className="font-mono">{setting.key}</span>
                </>
              }
              description={setting.description}
              amount={setting.amount}
              currency={code}
              trigger={
                <Button variant="outline" size="sm">
                  {setting.amount ? "Edit" : "Set"}
                </Button>
              }
              onSubmit={(amount) =>
                amount === null ? undefined : onSave(setting.key, amount)
              }
            />
          </CanAct>
        ),
      },
    ],
    [code, onSave]
  )

  return (
    <QueryTable
      query={query}
      what="settings"
      title="Amounts"
      description="Every one needs an amount before money can be switched on in this currency."
      columns={columns}
      rowKey={(setting) => setting.key}
      empty="No settings."
    />
  )
}
