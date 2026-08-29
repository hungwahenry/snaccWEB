import type { ReactNode } from "react"
import { DataTablePagination } from "./data-table-pagination"

export interface TableFrameProps {
  /** Names the list when a page holds more than one. */
  title?: ReactNode
  description?: ReactNode
  /** Search and filters, rendered above the table. */
  toolbar?: ReactNode
  children: ReactNode
  /** Server-side paging. Omit all four for a table that shows everything it is given. */
  page?: number
  perPage?: number
  total?: number
  onPageChange?: (page: number) => void
}

/**
 * The one shell every admin list sits in: filters above, a bordered table, paging below. Whether
 * the rows come from column definitions or hand-written markup, the page looks the same.
 */
export function TableFrame({
  title,
  description,
  toolbar,
  children,
  page,
  perPage,
  total,
  onPageChange,
}: TableFrameProps) {
  const paged =
    page !== undefined &&
    perPage !== undefined &&
    total !== undefined &&
    onPageChange !== undefined

  return (
    <div className="flex flex-col gap-4">
      {(title || description || toolbar) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            {title ? <h2 className="font-medium">{title}</h2> : null}
            {description ? (
              <p className="text-sm text-pretty text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          {toolbar}
        </div>
      )}
      <div className="rounded-lg border">{children}</div>
      {paged && (
        <DataTablePagination
          page={page}
          perPage={perPage}
          total={total}
          onPageChange={onPageChange}
        />
      )}
    </div>
  )
}
