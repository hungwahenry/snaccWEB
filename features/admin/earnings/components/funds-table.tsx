"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { useMemo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import {
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { formatNaira } from "@/lib/format"
import type { AdminFund, FundInput } from "../types"
import { FundDialog } from "./fund-dialog"

export function FundsTable({
  query,
  actions,
  onAdjust,
}: {
  query: UseQueryResult<AdminFund[]>
  actions: ReactNode
  onAdjust: (input: FundInput) => Promise<unknown>
}) {
  const columns = useMemo<Column<AdminFund>[]>(
    () => [
      {
        id: "campus",
        header: "Campus",
        className: "font-medium",
        cell: (fund) => fund.university.name,
      },
      {
        id: "cap",
        header: "Cap",
        align: "end",
        className: "tabular-nums",
        cell: (fund) => formatNaira(fund.cap),
      },
      {
        id: "distributed",
        header: "Distributed",
        align: "end",
        className: "tabular-nums",
        cell: (fund) => formatNaira(fund.distributed),
      },
      {
        id: "remaining",
        header: "Remaining",
        align: "end",
        className: "tabular-nums",
        cell: (fund) => formatNaira(fund.cap - fund.distributed),
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (fund) => (
          <CanAct permission="earnings.manage_funds">
            <FundDialog
              fund={fund}
              trigger={
                <Button variant="outline" size="sm">
                  Adjust cap
                </Button>
              }
              onSubmit={onAdjust}
            />
          </CanAct>
        ),
      },
    ],
    [onAdjust]
  )

  return (
    <QueryTable
      query={query}
      what="campus funds"
      title="Campus funds"
      actions={actions}
      columns={columns}
      rowKey={(fund) => fund.university_id}
      empty="No campus is in paid mode yet."
    />
  )
}
