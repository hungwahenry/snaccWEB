import { ChevronDownIcon } from "lucide-react"
import type { CommentSort } from "../../types"
import { sortLabel } from "../../utils/sorts"

export function CommentSortRow({
  value,
  total,
  onPress,
}: {
  value: CommentSort
  total: number
  onPress: () => void
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm font-bold text-muted-foreground">
        {total === 1 ? "1 comment" : `${total} comments`}
      </span>
      <button
        type="button"
        onClick={onPress}
        className="flex items-center gap-1 text-sm font-bold text-foreground active:opacity-60"
      >
        {sortLabel(value)}
        <ChevronDownIcon className="size-4" />
      </button>
    </div>
  )
}
