"use client"

import { Snowflake } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { DataTable, type Column } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatNaira, formatNumber } from "@/lib/format"
import { queryOf, useListParams } from "@/lib/use-list-params"
import { UserCell } from "@/components/admin/user-cell"
import type { WalletAccountRow } from "../types"
import { useWalletAccounts } from "../hooks/use-wallet"

const STATES = [
  { value: "any", label: "Any state" },
  { value: "true", label: "Frozen" },
  { value: "false", label: "Active" },
]

export function WalletAccountsView() {
  const router = useRouter()
  const { params, set, setPage, reset, active } = useListParams<{
    frozen: string
    funded: string
  }>({ frozen: "", funded: "" })

  const query = useWalletAccounts(
    queryOf({
      page: params.page,
      perPage: 20,
      q: params.q,
      frozen: params.frozen,
      funded: params.funded,
    })
  )

  const columns = useMemo<Column<WalletAccountRow>[]>(
    () => [
      {
        id: "user",
        header: "Holder",
        cell: ({ row }) => <UserCell user={row.original.user} />,
      },
      {
        accessorKey: "balance",
        header: "Balance",
        cell: ({ row }) => (
          <span className="font-medium tabular-nums">
            {formatNaira(row.original.balance)}
          </span>
        ),
      },
      {
        accessorKey: "entries_count",
        header: "Movements",
        cell: ({ row }) => (
          <span className="tabular-nums">
            {formatNumber(row.original.entries_count)}
          </span>
        ),
      },
      {
        id: "state",
        header: "State",
        enableSorting: false,
        cell: ({ row }) =>
          row.original.frozen_at ? (
            <Badge variant="destructive">
              <Snowflake className="size-3" />
              Frozen
            </Badge>
          ) : (
            <Badge variant="secondary">Active</Badge>
          ),
      },
    ],
    []
  )

  return (
    <DataTable
      columns={columns}
      rows={query.data?.items}
      isPending={query.isPending}
      page={query.data?.page ?? params.page}
      perPage={query.data?.per_page ?? 20}
      total={query.data?.total ?? 0}
      onPageChange={setPage}
      onRowClick={(row) =>
        row.user_id && router.push(`/admin/wallet/${row.user_id}`)
      }
      empty="No wallets match that."
      toolbar={
        <DataTableToolbar
          search={params.q}
          onSearchChange={(q) => set({ q })}
          placeholder="Username, name or email…"
          onReset={active ? reset : undefined}
          filters={
            <>
              <Select
                value={params.frozen || "any"}
                onValueChange={(value) =>
                  set({ frozen: value === "any" ? null : value })
                }
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={params.funded || "any"}
                onValueChange={(value) =>
                  set({ funded: value === "any" ? null : value })
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any balance</SelectItem>
                  <SelectItem value="true">Holding money</SelectItem>
                </SelectContent>
              </Select>
            </>
          }
        />
      }
    />
  )
}
