import type { UseQueryResult } from "@tanstack/react-query"
import Link from "next/link"
import type { ReactNode } from "react"
import type { Column } from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import { adPath } from "@/features/admin/shell/routes"
import { snaccPreview } from "@/features/admin/snaccs/utils/snaccs"
import type { Paginated } from "@/lib/api/types"
import { formatDate, formatNaira, formatNumber, shortDate } from "@/lib/format"
import type { AdminAd } from "../types"
import { adStatus } from "../utils/status"
import { PersonCell } from "./person-cell"

const COLUMNS: Column<AdminAd>[] = [
  {
    id: "advertiser",
    header: "Advertiser",
    className: "max-w-48",
    cell: (ad) => <PersonCell person={ad.advertiser} />,
  },
  {
    id: "snacc",
    header: "Snacc",
    className: "max-w-xs",
    cell: (ad) => (
      <>
        <Link
          href={adPath(ad.id)}
          className="block truncate text-sm font-medium underline-offset-4 hover:underline"
        >
          {snaccPreview(ad.snacc)}
        </Link>
        <p className="text-xs text-muted-foreground">
          Sent {formatDate(ad.created_at)}
        </p>
      </>
    ),
  },
  {
    id: "money",
    header: "Budget",
    align: "end",
    className: "tabular-nums",
    cell: (ad) => (
      <>
        <p>{formatNaira(ad.budget_kobo)}</p>
        <p className="text-xs text-muted-foreground">
          {formatNaira(ad.spent_kobo)} spent
        </p>
      </>
    ),
  },
  {
    id: "results",
    header: "Results",
    align: "end",
    className: "tabular-nums",
    cell: (ad) => (
      <>
        <p>{formatNumber(ad.views_count)} views</p>
        <p className="text-xs text-muted-foreground">
          {formatNumber(ad.clicks_count)} clicks
        </p>
      </>
    ),
  },
  {
    id: "dates",
    header: "Runs",
    className: "whitespace-nowrap text-muted-foreground",
    cell: (ad) => `${shortDate(ad.starts_at)} – ${shortDate(ad.ends_at)}`,
  },
  {
    id: "status",
    header: "Status",
    cell: (ad) => <StatusBadge status={adStatus(ad)} />,
  },
]

export function AdsTable({
  query,
  empty,
  toolbar,
  onPageChange,
}: {
  query: UseQueryResult<Paginated<AdminAd>>
  empty: string
  toolbar: ReactNode
  onPageChange: (page: number) => void
}) {
  return (
    <QueryTable
      query={query}
      what="promotions"
      columns={COLUMNS}
      rowKey={(ad) => ad.id}
      empty={empty}
      toolbar={toolbar}
      onPageChange={onPageChange}
    />
  )
}
