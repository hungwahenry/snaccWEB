import { EmptyState } from "@/components/ui/empty-state"
import { Spinner } from "@/components/ui/spinner"
import { UserAvatar } from "@/components/ui/user-avatar"
import type { TypeaheadSuggestion } from "../../hooks/composer/use-composer-typeahead"

export function ComposerSuggestions({
  suggestions,
  loading,
  onPick,
}: {
  suggestions: TypeaheadSuggestion[]
  loading: boolean
  onPick: (suggestion: TypeaheadSuggestion) => void
}) {
  return (
    <div className="max-h-48 overflow-y-auto border-t border-border">
      {suggestions.length === 0 ? (
        loading ? (
          <div className="flex justify-center py-4">
            <Spinner className="text-muted-foreground" />
          </div>
        ) : (
          <EmptyState compact title="No matches." className="py-4" />
        )
      ) : (
        suggestions.map((suggestion) => (
          <button
            key={suggestion.key}
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onPick(suggestion)}
            className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent"
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
