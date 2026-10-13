"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { useMemo, type ReactNode } from "react"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ActionSwitch } from "@/features/admin/shell/components/action-switch"
import type { Column } from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
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
            <p className="font-medium">{country.name}</p>
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
            <ActionSwitch
              checked={country.open}
              label={`Open Snacc in ${country.name}`}
              onChange={(open) => onSetOpen(country.code, open)}
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
