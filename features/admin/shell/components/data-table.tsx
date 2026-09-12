"use client"

import { memo, type ReactNode } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export interface Column<T> {
  id: string
  header: ReactNode
  cell: (row: T) => ReactNode
  align?: "start" | "end"
  className?: string
}

/** A header the eye skips but a screen reader still announces. */
export function HiddenHeader({ children }: { children: ReactNode }) {
  return <span className="sr-only">{children}</span>
}

export function alignClass(align: Column<unknown>["align"]) {
  return align === "end" ? "text-right" : undefined
}

function RowView<T>({ row, columns }: { row: T; columns: Column<T>[] }) {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.id}
          className={cn(alignClass(column.align), column.className)}
        >
          {column.cell(row)}
        </TableCell>
      ))}
    </TableRow>
  )
}

const Row = memo(RowView) as typeof RowView

/**
 * Rows re-render only when their own data or the columns change, so keep `columns` stable
 * (a module constant, or `useMemo` over the callbacks it closes over).
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  empty,
  hideHeader = false,
}: {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  empty: ReactNode
  hideHeader?: boolean
}) {
  return (
    <Table>
      {hideHeader ? null : (
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.id}
                className={cn(alignClass(column.align), column.className)}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="py-10 text-center text-sm whitespace-normal text-muted-foreground"
            >
              {empty}
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row) => (
            <Row key={rowKey(row)} row={row} columns={columns} />
          ))
        )}
      </TableBody>
    </Table>
  )
}
