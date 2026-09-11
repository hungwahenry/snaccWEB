import type { UseQueryResult } from "@tanstack/react-query"
import type { ReactNode } from "react"
import type { Paginated } from "@/lib/api/types"
import { DataTable, type Column } from "./data-table"
import { QueryView, TableSkeleton } from "./query-view"
import { TableFrame } from "./table-frame"
import { TablePagination } from "./table-pagination"

/**
 * A table fed straight from a query: skeleton rows while it loads, an error with a retry if it
 * fails, and pages under it when the API pages. Filters stay put through all three, so a filter
 * that finds nothing, or fails, can be changed back.
 */
export function QueryTable<T>({
  query,
  what,
  columns,
  rowKey,
  empty,
  title,
  description,
  actions,
  toolbar,
  onPageChange,
}: {
  query: UseQueryResult<T[] | Paginated<T>>
  what: string
  columns: Column<T>[]
  rowKey: (row: T) => string
  empty: ReactNode
  title?: ReactNode
  description?: ReactNode
  actions?: ReactNode
  toolbar?: ReactNode
  onPageChange?: (page: number) => void
}) {
  const data = query.data
  const paged = data && !Array.isArray(data) ? data : null

  return (
    <TableFrame
      title={title}
      description={description}
      actions={actions}
      toolbar={toolbar}
      dimmed={query.isPlaceholderData}
      footer={
        paged && onPageChange ? (
          <TablePagination
            page={paged.page}
            perPage={paged.per_page}
            total={paged.total}
            onPageChange={onPageChange}
          />
        ) : null
      }
    >
      <QueryView query={query} what={what} loading={<TableSkeleton />}>
        {(result) => (
          <DataTable
            columns={columns}
            rows={Array.isArray(result) ? result : result.items}
            rowKey={rowKey}
            empty={empty}
          />
        )}
      </QueryView>
    </TableFrame>
  )
}
