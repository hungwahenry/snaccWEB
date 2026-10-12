"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { SearchField } from "@/features/admin/shell/components/search-field"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { AdPricesTable } from "../components/ad-prices-table"
import { useAdPricesScreen } from "../hooks/use-ad-prices-screen"

export function AdPricesScreen() {
  const { list, query, actions, defaultKobo } = useAdPricesScreen()

  return (
    <>
      <PageHeader
        title="Ad prices"
        description="What 1,000 views of a promotion cost on each campus. A view is charged at the price of the viewer's campus."
      />
      <AdPricesTable
        query={query}
        defaultKobo={defaultKobo}
        onPageChange={list.setPage}
        onSave={actions.save}
        onReset={actions.reset}
        toolbar={
          <TableToolbar onReset={list.filtered ? list.reset : undefined}>
            <SearchField
              value={list.values.q}
              onChange={(q) => list.setFilter({ q })}
              placeholder="Search by name or acronym"
            />
          </TableToolbar>
        }
      />
    </>
  )
}
