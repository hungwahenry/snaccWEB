import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatNumber } from "@/lib/format"
import { pageWindow } from "../utils/pagination"

export function TablePagination({
  page,
  perPage,
  total,
  onPageChange,
}: {
  page: number
  perPage: number
  total: number
  onPageChange: (page: number) => void
}) {
  const { first, last, pages } = pageWindow(page, perPage, total)

  return (
    <nav
      aria-label="Pages"
      className="flex flex-wrap items-center justify-between gap-3"
    >
      <p className="text-sm text-muted-foreground tabular-nums">
        {total === 0
          ? "Nothing to show"
          : `${formatNumber(first)}–${formatNumber(last)} of ${formatNumber(total)}`}
      </p>
      {pages > 1 ? (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground tabular-nums">
            Page {formatNumber(page)} of {formatNumber(pages)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
            <ChevronRight />
          </Button>
        </div>
      ) : null}
    </nav>
  )
}
