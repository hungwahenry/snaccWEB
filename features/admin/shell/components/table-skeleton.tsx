import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { alignClass, type Column } from "./data-table"

/** The table's own header over rows of placeholders, so the columns are in place before the data. */
export function TableSkeleton<T>({
  columns,
  rows = 6,
}: {
  columns: Column<T>[]
  rows?: number
}) {
  return (
    <div aria-busy aria-label="Loading">
      <Table>
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
        <TableBody>
          {Array.from({ length: rows }, (_, row) => (
            <TableRow key={row}>
              {columns.map((column) => (
                <TableCell key={column.id} className={column.className}>
                  <Skeleton
                    className={cn(
                      "my-0.5 h-4 w-20",
                      column.align === "end" && "ml-auto"
                    )}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
