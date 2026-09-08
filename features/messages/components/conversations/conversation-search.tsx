import { SearchIcon, XIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

export function ConversationSearch({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="px-4 pt-2 pb-2">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search messages and people"
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
    </div>
  )
}
