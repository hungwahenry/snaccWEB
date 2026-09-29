import type { Column } from "@/features/admin/shell/components/data-table"
import { formatNumber } from "@/lib/format"

export function countColumn<T>(
  id: string,
  header: string,
  value: (row: T) => number
): Column<T> {
  return {
    id,
    header,
    align: "end",
    className: "tabular-nums",
    cell: (row) => formatNumber(value(row)),
  }
}
