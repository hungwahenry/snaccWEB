import type { UseQueryResult } from "@tanstack/react-query"
import Link from "next/link"
import type { ReactNode } from "react"
import type { Column } from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { UserCell } from "@/features/admin/shell/components/user-cell"
import { walletPath } from "@/features/admin/shell/routes"
import type { Paginated } from "@/lib/api/types"
import { formatNaira, formatNumber } from "@/lib/format"
import type { WalletAccountRow } from "../types"
import { WalletStateBadge } from "./wallet-state-badge"

const COLUMNS: Column<WalletAccountRow>[] = [
  {
    id: "holder",
    header: "Holder",
    cell: (wallet) =>
      wallet.user_id ? (
        <Link
          href={walletPath(wallet.user_id)}
          className="block w-fit max-w-full underline-offset-4 hover:underline"
        >
          <UserCell user={wallet.user} linked={false} />
        </Link>
      ) : (
        <UserCell user={wallet.user} linked={false} />
      ),
  },
  {
    id: "balance",
    header: "Balance",
    className: "font-medium tabular-nums",
    cell: (wallet) => formatNaira(wallet.balance),
  },
  {
    id: "movements",
    header: "Movements",
    className: "tabular-nums",
    cell: (wallet) => formatNumber(wallet.entries_count),
  },
  {
    id: "state",
    header: "State",
    cell: (wallet) => <WalletStateBadge frozenAt={wallet.frozen_at} />,
  },
]

export function WalletsTable({
  query,
  toolbar,
  onPageChange,
}: {
  query: UseQueryResult<Paginated<WalletAccountRow>>
  toolbar: ReactNode
  onPageChange: (page: number) => void
}) {
  return (
    <QueryTable
      query={query}
      what="wallets"
      columns={COLUMNS}
      rowKey={(wallet) => wallet.id}
      empty="No wallets match that."
      toolbar={toolbar}
      onPageChange={onPageChange}
    />
  )
}
