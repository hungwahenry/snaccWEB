"use client"

import { TableFrame } from "@/components/data-table/table-frame"
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
import { useEngagement } from "@/features/admin/engagement/hooks/use-engagement"
import { formatDate, formatNaira } from "@/lib/format"
import type { Paginated } from "@/lib/api/types"
import type {
  AdminEarning,
  EarningParty,
  ListEarningsParams,
} from "../types"

function handle(party: EarningParty | null) {
  if (!party) return null
  return party.username ? `@${party.username}` : party.display_name || "—"
}

/**
 * Who caused the money to move. Only a credit has an actor; a claim is the beneficiary taking their
 * own balance, and an adjustment is an admin. Saying so beats a dash that looks like missing data.
 */
function cause(event: AdminEarning) {
  if (event.actor) return handle(event.actor)
  if (event.movement === "adjustment") {
    const by = handle(event.admin)
    return by ? `Adjusted by ${by}` : "Adjusted"
  }
  if (event.movement === "claim") return "Claimed"

  return "—"
}

/** A credit is named by what earned it; the other movements are named by themselves. */
function label(event: AdminEarning) {
  return event.type ?? event.movement
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
  // From the catalog rather than a list written out here: a kind added there starts paying, and a
  // filter that does not know about it hides the rows it pays for.
  const kinds = useEngagement().data ?? []

  return (
    <TableFrame
      title="Earning events"
      page={data.page}
      perPage={data.per_page}
      total={data.total}
      onPageChange={(page) => onParams({ page })}
      toolbar={
        <Select
          value={params.type ?? "all"}
          onValueChange={(value) =>
            onParams({
              type: !value || value === "all" ? undefined : (value as never),
              page: 1,
            })
          }
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {kinds.map((kind) => (
              <SelectItem key={kind.key} value={kind.key}>
                {kind.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
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
              <TableCell
                colSpan={5}
                className="py-10 text-center text-sm text-muted-foreground"
              >
                No earning events.
              </TableCell>
            </TableRow>
          ) : (
            data.items.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <Badge variant="outline">{label(event)}</Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatNaira(event.amount)}
                </TableCell>
                <TableCell className="text-sm">
                  {handle(event.beneficiary) ?? "—"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {cause(event)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(event.created_at)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableFrame>
  )
}
