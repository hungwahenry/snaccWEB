"use client"

import { DataPagination } from "@/components/data-pagination"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import type { AdminEarning, ListEarningsParams } from "./types"

function handle(party: AdminEarning["beneficiary"]) {
  return party.username ? `@${party.username}` : party.display_name || "—"
}

export function EarningsLedger({
  data,
  params,
  onParams,
}: {
  data: Paginated<AdminEarning>
  params: ListEarningsParams
  onParams: (patch: Partial<ListEarningsParams>) => void
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base">Earning events</CardTitle>
        <Select
          value={params.type ?? "all"}
          onValueChange={(value) =>
            onParams({ type: !value || value === "all" ? undefined : (value as never), page: 1 })
          }
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="reaction">Reaction</SelectItem>
            <SelectItem value="resnacc">Resnacc</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Beneficiary</TableHead>
              <TableHead>From</TableHead>
              <TableHead>When</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground py-10 text-center text-sm">
                  No earning events.
                </TableCell>
              </TableRow>
            ) : (
              data.items.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <Badge variant="outline">{event.type}</Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNaira(event.amount)}
                  </TableCell>
                  <TableCell className="text-sm">{handle(event.beneficiary)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {handle(event.actor)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(event.created_at)}
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
      </CardContent>
    </Card>
  )
}
