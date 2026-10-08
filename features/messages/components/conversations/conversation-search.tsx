import { SearchIcon, XIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

export function ConversationSearch({
  value,
  placeholder = "Search messages and people",
  onChange,
  onCancel,
}: {
  value: string
  placeholder?: string
  onChange: (value: string) => void
  onCancel: () => void
}) {
  return (
    <header className="sticky top-(--now-playing-height) z-30 flex h-14 animate-in items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur duration-150 fade-in motion-reduce:animate-none">
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") onCancel()
          }}
          placeholder={placeholder}
          aria-label={placeholder}
          autoFocus
          className="h-10 rounded-full pr-9 pl-10 [&::-webkit-search-cancel-button]:hidden"
        />
        {value.length > 0 ? (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <XIcon className="size-4" />
          </button>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onCancel}
        className="text-base font-semibold text-foreground hover:opacity-70"
      >
        Cancel
      </button>
    </header>
  )
}
