"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { SearchField } from "@/features/admin/shell/components/search-field"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { AdsStats } from "../components/ads-stats"
import { AdsTable } from "../components/ads-table"
import { StatusTabs } from "../components/status-tabs"
import { useAdsScreen } from "../hooks/use-ads-screen"
import { emptyNote } from "../utils/status"

export function AdsScreen() {
  const { list, query, stats, tabs } = useAdsScreen()

  return (
    <>
      <PageHeader
        title="Promotions"
        description="Snaccs people pay to show to an audience. Nothing shows until someone approves it, and pending ones wait here oldest first."
      />
      <div className="flex flex-col gap-6">
        <AdsStats stats={stats.data} pending={stats.isPending} />
        <div className="flex flex-col gap-3">
          <StatusTabs
            tabs={tabs}
            value={list.values.status}
            onChange={(status) => list.setFilter({ status })}
          />
          <AdsTable
            query={query}
            empty={emptyNote(list.values.status, list.query.q.trim() !== "")}
            onPageChange={list.setPage}
            toolbar={
              <TableToolbar onReset={list.filtered ? list.reset : undefined}>
                <SearchField
                  value={list.values.q}
                  onChange={(q) => list.setFilter({ q })}
                  placeholder="Advertiser name, handle or email"
                />
              </TableToolbar>
            }
          />
        </div>
      </div>
    </>
  )
}
