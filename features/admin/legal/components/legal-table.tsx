"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import Link from "next/link"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import type { Column } from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import { legalDocumentPath } from "@/features/admin/shell/routes"
import { formatDate, formatNumber } from "@/lib/format"
import type { AdminLegalSummary } from "../types"
import { STANDING, standingOf, whereLabel } from "../utils/legal"

export function LegalTable({
  query,
  countryNames,
}: {
  query: UseQueryResult<AdminLegalSummary[]>
  countryNames: ReadonlyMap<string, string>
}) {
  const all = query.data
  const columns = useMemo<Column<AdminLegalSummary>[]>(
    () => [
      {
        id: "document",
        header: "Document",
        cell: (doc) => (
          <div className="min-w-0">
            <p className="font-medium">{doc.title}</p>
            <p className="text-xs text-muted-foreground">
              {whereLabel(doc.country_code, countryNames)}
            </p>
          </div>
        ),
      },
      {
        id: "version",
        header: "Version",
        cell: (doc) => doc.version,
      },
      {
        id: "standing",
        header: "Status",
        cell: (doc) => (
          <StatusBadge status={STANDING[standingOf(doc, all ?? [])]} />
        ),
      },
      {
        id: "agreed",
        header: "Agreed",
        className: "text-muted-foreground",
        cell: (doc) => formatNumber(doc.accepted_count),
      },
      {
        id: "date",
        header: "Published",
        className: "text-muted-foreground",
        cell: (doc) => (doc.published_at ? formatDate(doc.published_at) : "—"),
      },
      {
        id: "actions",
        header: "Actions",
        align: "end",
        cell: (doc) => (
          <Button
            variant="outline"
            size="sm"
            render={<Link href={legalDocumentPath(doc.id)} />}
          >
            {doc.published_at ? "View" : "Edit"}
          </Button>
        ),
      },
    ],
    [all, countryNames]
  )

  return (
    <QueryTable
      query={query}
      what="legal documents"
      columns={columns}
      rowKey={(doc) => doc.id}
      empty="No legal documents yet."
    />
  )
}
