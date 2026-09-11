"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import Link from "next/link"
import type { ReactNode } from "react"
import type { Column } from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import type { Paginated } from "@/lib/api/types"
import { formatDate } from "@/lib/format"
import type { ModerationScan } from "../types"
import { ACTION_STATUS } from "../utils/actions"
import { isEnforced, latencyLabel, scanScore, scanTarget } from "../utils/scans"

const COLUMNS: Column<ModerationScan>[] = [
  {
    id: "when",
    header: "When",
    className: "text-sm",
    cell: (scan) => {
      const href = scanTarget(scan)

      return href ? (
        <Link href={href} className="underline-offset-4 hover:underline">
          {formatDate(scan.created_at)}
        </Link>
      ) : (
        formatDate(scan.created_at)
      )
    },
  },
  {
    id: "surface",
    header: "Surface",
    className: "text-sm",
    cell: (scan) => scan.surface,
  },
  {
    id: "verdict",
    header: "Decided",
    cell: (scan) => <StatusBadge status={ACTION_STATUS[scan.verdict]} />,
  },
  {
    id: "applied",
    header: "Applied",
    cell: (scan) =>
      isEnforced(scan) ? (
        <StatusBadge status={ACTION_STATUS[scan.applied]} />
      ) : (
        <span className="text-xs text-muted-foreground">
          {scan.applied} (not enforced)
        </span>
      ),
  },
  {
    id: "because",
    header: "Because",
    className: "font-mono text-xs",
    cell: (scan) =>
      scan.error ? (
        <span className="text-destructive">{scan.error}</span>
      ) : (
        (scanScore(scan) ?? "—")
      ),
  },
  {
    id: "took",
    header: "Took",
    align: "end",
    className: "text-sm tabular-nums",
    cell: (scan) => latencyLabel(scan.latency_ms),
  },
]

export function ScansTable({
  query,
  toolbar,
  onPageChange,
}: {
  query: UseQueryResult<Paginated<ModerationScan>>
  toolbar: ReactNode
  onPageChange: (page: number) => void
}) {
  return (
    <QueryTable
      query={query}
      what="reviews"
      title="Reviews"
      description="Every review the pipeline has done. What it decided and what it was allowed to do differ while enforcement is off."
      toolbar={toolbar}
      columns={COLUMNS}
      rowKey={(scan) => scan.id}
      empty="Nothing reviewed yet."
      onPageChange={onPageChange}
    />
  )
}
