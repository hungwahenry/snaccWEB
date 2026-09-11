import { EmptyState } from "@/components/ui/empty-state"
import { Spinner } from "@/components/ui/spinner"
import { UserAvatar } from "@/components/ui/user-avatar"
import { cn } from "@/lib/utils"
import type { TypeaheadSuggestion } from "../../types"

export function ComposerSuggestions({
  suggestions,
  loading,
  highlighted,
  onPick,
}: {
  suggestions: TypeaheadSuggestion[]
  loading: boolean
  /** The row the arrow keys are on; Enter or Tab picks it. */
  highlighted: number
  onPick: (suggestion: TypeaheadSuggestion) => void
}) {
  return (
    <div
      role="listbox"
      aria-label="Suggestions"
      className="max-h-48 overflow-y-auto border-t border-border"
    >
      {suggestions.length === 0 ? (
        loading ? (
          <div className="flex justify-center py-4">
            <Spinner className="text-muted-foreground" />
          </div>
        ) : (
          <EmptyState compact title="No matches." className="py-4" />
        )
      ) : (
        suggestions.map((suggestion, index) => (
          <button
            key={suggestion.key}
            type="button"
            role="option"
            aria-selected={index === highlighted}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onPick(suggestion)}
            className={cn(
              "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent",
              index === highlighted && "bg-accent"
            )}
          >
            {suggestion.avatarUrl ? (
              <UserAvatar
                alt={suggestion.label}
                avatarUrl={suggestion.avatarUrl}
                name={suggestion.label.slice(1)}
                className="size-8"
                textClassName="text-xs"
              />
            ) : null}
            <span className="font-bold text-foreground">
              {suggestion.label}
            </span>
            {suggestion.hint ? (
              <span className="flex-1 truncate text-sm text-muted-foreground">
                {suggestion.hint}
              </span>
            ) : null}
          </button>
        ))
      )}
    </div>
  )
}
