"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import type { Column } from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import { formatNumber } from "@/lib/format"
import type { CategoryUsage } from "../types"
import { scoreSources } from "../utils/moderation"

const COLUMNS: Column<CategoryUsage>[] = [
  {
    id: "category",
    header: "Category",
    className: "whitespace-normal",
    cell: (entry) => (
      <>
        <p className="font-medium">{entry.label}</p>
        <p className="max-w-lg text-xs text-pretty text-muted-foreground">
          {entry.description}
        </p>
      </>
    ),
  },
  {
    id: "key",
    header: "Key",
    className: "font-mono text-xs text-muted-foreground",
    cell: (entry) => entry.category,
  },
  {
    id: "sources",
    header: "Scores from",
    cell: (entry) => (
      <div className="flex flex-wrap gap-1.5">
        {scoreSources(entry).map((source) => (
          <StatusBadge key={source.label} status={source} />
        ))}
      </div>
    ),
  },
  {
    id: "rules",
    header: "Rules",
    className: "text-sm text-muted-foreground",
    cell: (entry) =>
      entry.ruled.length === 0 ? (
        <span className="text-destructive">none</span>
      ) : (
        entry.ruled.join(", ")
      ),
  },
  {
    id: "seen",
    header: "Seen",
    align: "end",
    className: "tabular-nums",
    cell: (entry) => formatNumber(entry.scans),
  },
]

export function CategoriesTable({
  query,
}: {
  query: UseQueryResult<CategoryUsage[]>
}) {
  return (
    <QueryTable
      query={query}
      what="categories"
      title="Categories"
      description="What the classifier can score, and which of them you have rules for. A category with no rule is scored and recorded but never acted on."
      columns={COLUMNS}
      rowKey={(entry) => entry.category}
      empty="No categories yet."
    />
  )
}
