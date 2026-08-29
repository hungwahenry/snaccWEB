import type { ReactNode } from "react"
import { DataTablePagination } from "./data-table-pagination"

export interface TableFrameProps {
  title?: ReactNode
  description?: ReactNode
  toolbar?: ReactNode
  children: ReactNode
  page?: number
  perPage?: number
  total?: number
  onPageChange?: (page: number) => void
}

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
