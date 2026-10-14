"use client"

import { OptionSelect } from "@/features/admin/shell/components/option-select"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { SearchField } from "@/features/admin/shell/components/search-field"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { LedgerTable } from "../components/ledger-table"
import { useLedgerScreen } from "../hooks/use-ledger-screen"
import { TRANSACTION_OPTIONS } from "../utils/wallet"

export function LedgerScreen() {
  const { list, query } = useLedgerScreen()

  return (
    <>
      <PageHeader
        title="Ledger"
        description="Every posting that moved money, newest first. Open one to see both sides."
      />
      <LedgerTable
        query={query}
        onPageChange={list.setPage}
        toolbar={
          <TableToolbar onReset={list.filtered ? list.reset : undefined}>
            <SearchField
              value={list.values.q}
              onChange={(q) => list.setFilter({ q })}
              placeholder="Reference, username or email…"
            />
            <OptionSelect
              label="Kind"
              allLabel="Every kind"
              value={list.values.type}
              onChange={(type) => list.setFilter({ type })}
              options={TRANSACTION_OPTIONS}
            />
          </TableToolbar>
        }
      />
    </>
  )
}
