"use client"

import { OptionSelect } from "@/features/admin/shell/components/option-select"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { SearchField } from "@/features/admin/shell/components/search-field"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { WithdrawalsSummary } from "../components/withdrawals-summary"
import { WithdrawalsTable } from "../components/withdrawals-table"
import { useWithdrawalsScreen } from "../hooks/use-withdrawals-screen"
import { STATUS_OPTIONS } from "../utils/status"

export function WithdrawalsScreen() {
  const { list, query, summary } = useWithdrawalsScreen()

  return (
    <>
      <PageHeader
        title="Withdrawals"
        description="Money on its way to a bank, and what has landed."
      />
      <div className="flex flex-col gap-6">
        <WithdrawalsSummary summary={summary.data} />
        <WithdrawalsTable
          query={query}
          onPageChange={list.setPage}
          toolbar={
            <TableToolbar onReset={list.filtered ? list.reset : undefined}>
              <SearchField
                value={list.values.q}
                onChange={(q) => list.setFilter({ q })}
                placeholder="Search by name, handle or email"
              />
              <OptionSelect
                label="Status"
                allLabel="Any status"
                value={list.values.status}
                onChange={(status) => list.setFilter({ status })}
                options={STATUS_OPTIONS}
              />
            </TableToolbar>
          }
        />
      </div>
    </>
  )
}
