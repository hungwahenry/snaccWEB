"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { SearchField } from "@/features/admin/shell/components/search-field"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { CountriesTable } from "../components/countries-table"
import { useCountriesScreen } from "../hooks/use-countries-screen"

export function CountriesScreen() {
  const { query, actions, search, setSearch } = useCountriesScreen()

  return (
    <>
      <PageHeader
        title="Countries"
        description="Where Snacc is open. Anyone can sign up from anywhere, but only people at campuses in open countries get in; everyone else waits, and gets an email the moment their country opens."
      />
      <CountriesTable
        query={query}
        onSetOpen={actions.setOpen}
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
