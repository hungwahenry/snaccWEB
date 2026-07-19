import { Button } from "@/components/ui/button"

export function DataPagination({
  page,
  lastPage,
  total,
  onPage,
}: {
  page: number
  lastPage: number
  total: number
  onPage: (page: number) => void
}) {
  return (
    <div className="flex items-center justify-between pt-4">
      <span className="text-muted-foreground text-sm">{total} total</span>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          Previous
        </Button>
        <span className="text-sm">
          Page {page} of {Math.max(lastPage, 1)}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= lastPage}
          onClick={() => onPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
