"use client"

import { useRouter } from "next/navigation"
import { DataPagination } from "@/components/data-pagination"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate, formatNaira } from "@/lib/format"
import type { Paginated } from "@/lib/api/types"
import type { AdminWithdrawal, ListWithdrawalsParams, WithdrawalStatus } from "./types"

export const STATUS_VARIANT: Record<
  WithdrawalStatus,
  "secondary" | "default" | "destructive" | "outline"
> = {
  pending: "secondary",
  success: "default",
  failed: "destructive",
  reversed: "outline",
}

export function WithdrawalsTable({
  data,
  params,
  onParams,
}: {
  data: Paginated<AdminWithdrawal>
  params: ListWithdrawalsParams
  onParams: (patch: Partial<ListWithdrawalsParams>) => void
}) {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-4">
      <Select
        value={params.status ?? "all"}
        onValueChange={(value) =>
          onParams({ status: !value || value === "all" ? undefined : (value as never), page: 1 })
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="success">Success</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
          <SelectItem value="reversed">Reversed</SelectItem>
        </SelectContent>
      </Select>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>User</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Requested</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground py-10 text-center text-sm">
                No withdrawals match these filters.
              </TableCell>
            </TableRow>
          ) : (
            data.items.map((withdrawal) => (
              <TableRow
                key={withdrawal.id}
                className="cursor-pointer"
                onClick={() => router.push(`/admin/withdrawals/${withdrawal.id}`)}
              >
                <TableCell className="font-mono text-xs">{withdrawal.reference}</TableCell>
                <TableCell className="text-sm">
                  {withdrawal.user.username
                    ? `@${withdrawal.user.username}`
                    : withdrawal.user.display_name}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatNaira(withdrawal.amount)}
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[withdrawal.status]}>{withdrawal.status}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(withdrawal.created_at)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <DataPagination
        page={data.page}
        lastPage={data.last_page}
        total={data.total}
        onPage={(page) => onParams({ page })}
      />
    </div>
  )
}
