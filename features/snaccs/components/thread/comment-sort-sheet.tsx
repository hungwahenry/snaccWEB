import { CheckIcon } from "lucide-react"
import { ActionSheet } from "@/components/ui/action-sheet"
import type { CommentSort } from "../../types"
import { COMMENT_SORTS } from "../../utils/sorts"

export function CommentSortSheet({
  open,
  onOpenChange,
  value,
  onSelect,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: CommentSort
  onSelect: (sort: CommentSort) => void
}) {
  return (
    <ActionSheet open={open} onOpenChange={onOpenChange} title="Sort comments">
      {COMMENT_SORTS.map((sort) => (
        <button
          key={sort.value}
          type="button"
          onClick={() => onSelect(sort.value)}
          className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-accent/60"
        >
          <span className="flex-1">
            <span className="block font-bold text-foreground">
              {sort.label}
            </span>
            <span className="block text-sm text-muted-foreground">
              {sort.hint}
            </span>
          </span>
          {sort.value === value ? (
            <CheckIcon className="size-5 text-foreground" />
          ) : null}
        </button>
      ))}
    </ActionSheet>
  )
}
