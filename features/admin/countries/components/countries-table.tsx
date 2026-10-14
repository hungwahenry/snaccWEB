"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import Link from "next/link"
import { useMemo, type ReactNode } from "react"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { Button } from "@/components/ui/button"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import type { Column } from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { countryPath } from "@/features/admin/shell/routes"
import { formatNumber } from "@/lib/format"
import type { AdminCountry } from "../types"
import { MinAgeDialog } from "./min-age-dialog"

export function CountriesTable({
  query,
  toolbar,
  onSetOpen,
  onSetMinAge,
}: {
  query: UseQueryResult<AdminCountry[]>
  toolbar: ReactNode
  onSetOpen: (code: string, open: boolean) => Promise<unknown>
  onSetMinAge: (code: string, minAge: number) => Promise<unknown>
}) {
  const columns = useMemo<Column<AdminCountry>[]>(
    () => [
      {
        id: "country",
        header: "Country",
        cell: (country) => (
          <div>
            <Link
              href={countryPath(country.code)}
              className="font-medium hover:underline"
            >
              {country.name}
            </Link>
            <p className="text-xs text-muted-foreground">
              {country.code} · {country.currency}
            </p>
          </div>
        ),
      },
      {
        id: "campuses",
        header: "Campuses",
        align: "end",
        className: "tabular-nums",
        cell: (country) => formatNumber(country.campuses),
      },
      {
        id: "minAge",
        header: "Minimum age",
        align: "end",
        className: "tabular-nums",
        cell: (country) => (
          <CanAct permission="countries.write">
            <MinAgeDialog
              country={country}
              onSave={(minAge) => onSetMinAge(country.code, minAge)}
            />
          </CanAct>
        ),
      },
      {
        id: "open",
        header: "Open",
        align: "end",
        className: "w-24",
        cell: (country) => (
          <CanAct permission="countries.write">
            <ConfirmAction
              trigger={
                <Button variant="outline" size="sm">
                  {country.open ? "Close" : "Open"}
                </Button>
              }
              tone={country.open ? "destructive" : "default"}
              title={
                country.open
                  ? `Close Snacc in ${country.name}?`
                  : `Open Snacc in ${country.name}?`
              }
              description={
                country.open
                  ? "Everyone there is held at the waiting screen until it opens again."
                  : "Everyone waiting there gets in straight away and is emailed now. The emails can't be taken back."
              }
              confirmLabel={country.open ? "Close it" : "Open it"}
              onConfirm={() => onSetOpen(country.code, !country.open)}
            />
          </CanAct>
        ),
      },
    ],
    [onSetOpen, onSetMinAge]
  )

  return (
    <QueryTable
      query={query}
      what="countries"
      columns={columns}
      rowKey={(country) => country.code}
      empty="No country by that name."
      toolbar={toolbar}
    />
  )
}
