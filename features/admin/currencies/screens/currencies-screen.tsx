"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { SearchField } from "@/features/admin/shell/components/search-field"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { CurrenciesTable } from "../components/currencies-table"
import { useCurrenciesScreen } from "../hooks/use-currencies-screen"

export function CurrenciesScreen() {
  const { query, actions, search, setSearch } = useCurrenciesScreen()

  return (
    <>
      <PageHeader
        title="Currencies"
        description="Money moves only in a currency that is switched on, and only for people whose country uses it. Set every amount first: limits, fees, prices and budgets, each in that currency."
      />
      <CurrenciesTable
        query={query}
        onSetEnabled={actions.setEnabled}
        toolbar={
          <TableToolbar>
            <SearchField
              value={search}
              onChange={setSearch}
              placeholder="Search by name or code"
            />
          </TableToolbar>
        }
      />
    </>
  )
}
