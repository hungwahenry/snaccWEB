"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import Link from "next/link"
import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import type { Column } from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { StickerImage } from "@/features/admin/shell/components/sticker-image"
import { UserCell } from "@/features/admin/shell/components/user-cell"
import { stickerPackPath } from "@/features/admin/shell/routes"
import { plural } from "@/features/admin/shell/utils/format"
import type { Paginated } from "@/lib/api/types"
import { formatDate, formatNumber } from "@/lib/format"
import type { AdminStickerPack } from "../types"
import { packBadges } from "../utils/packs"
import { PackBadges } from "./pack-badges"

const COLUMNS: Column<AdminStickerPack>[] = [
  {
    id: "pack",
    header: "Pack",
    className: "min-w-64",
    cell: (pack) => (
      <div className="flex items-center gap-3">
        <StickerImage
          src={pack.cover?.url ?? null}
          alt=""
          className="size-12 p-1"
        />
        <div className="flex min-w-0 flex-col gap-1">
          <Link
            href={stickerPackPath(pack.id)}
            className="truncate font-medium underline-offset-4 hover:underline"
          >
            {pack.title}
          </Link>
          <PackBadges badges={packBadges(pack)} />
        </div>
      </div>
    ),
  },
  {
    id: "owner",
    header: "Made by",
    cell: (pack) =>
      pack.owner ? (
        <UserCell user={pack.owner} />
      ) : (
        <span className="text-sm font-medium">Snacc</span>
      ),
  },
  {
    id: "stickers",
    header: "Stickers",
    align: "end",
    className: "tabular-nums",
    cell: (pack) => formatNumber(pack.stickers_count),
  },
  {
    id: "saves",
    header: "Saves",
    align: "end",
    className: "tabular-nums",
    cell: (pack) => formatNumber(pack.saves_count),
  },
  {
    id: "reports",
    header: "Open reports",
    align: "end",
    cell: (pack) =>
      pack.open_reports > 0 ? (
        <Badge variant="destructive">
          {plural(pack.open_reports, "report")}
        </Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    id: "created",
    header: "Started",
    className: "whitespace-nowrap text-muted-foreground",
    cell: (pack) => formatDate(pack.created_at),
  },
]

export function StickerPacksTable({
  query,
  filtered,
  toolbar,
  onPageChange,
}: {
  query: UseQueryResult<Paginated<AdminStickerPack>>
  filtered: boolean
  toolbar: ReactNode
  onPageChange: (page: number) => void
}) {
  return (
    <QueryTable
      query={query}
      what="sticker packs"
      columns={COLUMNS}
      rowKey={(pack) => pack.id}
      empty={
        filtered
          ? "No sticker packs match these filters."
          : "No sticker packs yet."
      }
      toolbar={toolbar}
      onPageChange={onPageChange}
    />
  )
}
