"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import Link from "next/link"
import { useMemo, type ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import {
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { CURRENCIES_PATH } from "@/features/admin/shell/routes"
import type { Paginated } from "@/lib/api/types"
import { formatMoney, type Money } from "@/lib/money"
import type { CampusPrice } from "../types"
import { PriceDialog } from "./price-dialog"

export function AdPricesTable({
  query,
  toolbar,
  onPageChange,
  onSave,
  onReset,
}: {
  query: UseQueryResult<Paginated<CampusPrice>>
  toolbar: ReactNode
  onPageChange: (page: number) => void
  onSave: (universityId: string, price: Money) => Promise<unknown>
  onReset: (universityId: string) => Promise<unknown>
}) {
  const columns = useMemo<Column<CampusPrice>[]>(
    () => [
      {
        id: "campus",
        header: "Campus",
        cell: (price) => (
          <div className="min-w-0">
            <p className="font-medium">{price.university.name}</p>
            <p className="text-xs text-muted-foreground">
              {price.university.acronym}
            </p>
          </div>
        ),
      },
      {
        id: "price",
        header: "Per 1,000 views",
        align: "end",
        className: "tabular-nums",
        cell: (price) => (
          <div className="flex items-center justify-end gap-2">
            {price.custom ? <Badge variant="secondary">Custom</Badge> : null}
            {formatMoney(price.price_per_thousand)}
          </div>
        ),
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (price) => (
          <div className="flex justify-end gap-2">
            <CanAct permission="ads.prices">
              <PriceDialog
                price={price}
                trigger={
                  <Button variant="outline" size="sm">
                    Set price
                  </Button>
                }
                onSubmit={(next) => onSave(price.university.id, next)}
              />
            </CanAct>
            {price.custom ? (
              <CanAct permission="ads.prices">
                <ConfirmAction
                  trigger={
                    <Button variant="ghost" size="sm">
                      Use default
                    </Button>
                  }
                  tone="default"
                  title={`Put ${price.university.acronym} back on the default?`}
                  description="Its views go back to costing the default per 1,000 set on its currency’s page."
                  confirmLabel="Use default"
                  onConfirm={() => onReset(price.university.id)}
                />
              </CanAct>
            ) : null}
          </div>
        ),
      },
    ],
    [onSave, onReset]
  )

  return (
    <QueryTable
      query={query}
      what="campus prices"
      columns={columns}
      rowKey={(price) => price.university.id}
      description={
        <>
          A campus without a price of its own costs the default per 1,000 views.
          Change it on the{" "}
          <Link href={CURRENCIES_PATH} className="underline underline-offset-4">
            Currencies page
          </Link>{" "}
          under{" "}
          <span className="font-mono text-xs">ads.price_per_thousand</span>.
        </>
      }
      empty="No campuses match that."
      toolbar={toolbar}
      onPageChange={onPageChange}
    />
  )
}
