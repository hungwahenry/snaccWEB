"use client"

import { OptionSelect } from "@/features/admin/shell/components/option-select"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { SearchField } from "@/features/admin/shell/components/search-field"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { WalletsSummary } from "../components/wallets-summary"
import { WalletsTable } from "../components/wallets-table"
import { useWalletsScreen } from "../hooks/use-wallets-screen"
import { FROZEN_OPTIONS, FUNDED_OPTIONS } from "../utils/wallet"

export function WalletsScreen() {
  const { list, query, summary } = useWalletsScreen()

  return (
    <>
      <PageHeader
        title="Wallets"
        description="Spendable balances, and every posting that produced them."
      />
      <div className="flex flex-col gap-6">
        <WalletsSummary summary={summary.data} pending={summary.isPending} />
        <WalletsTable
          query={query}
          onPageChange={list.setPage}
          toolbar={
            <TableToolbar onReset={list.filtered ? list.reset : undefined}>
              <SearchField
                value={list.values.q}
                onChange={(q) => list.setFilter({ q })}
                placeholder="Username, name or email…"
              />
              <OptionSelect
                label="State"
                allLabel="Any state"
                value={list.values.frozen}
                onChange={(frozen) => list.setFilter({ frozen })}
                options={FROZEN_OPTIONS}
                className="w-36"
              />
              <OptionSelect
                label="Balance"
                allLabel="Any balance"
                value={list.values.funded}
                onChange={(funded) => list.setFilter({ funded })}
                options={FUNDED_OPTIONS}
              />
            </TableToolbar>
          }
        />
      </div>
    </>
  )
}
