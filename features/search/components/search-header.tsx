import { ArrowLeftIcon, SearchIcon, XIcon } from "lucide-react"
import { IconButton } from "@/components/ui/icon-button"
import { Input } from "@/components/ui/input"

export function SearchHeader({
  value,
  onChange,
  onBack,
}: {
  value: string
  onChange: (value: string) => void
  onBack: () => void
}) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/90 px-3 backdrop-blur">
      <IconButton
        icon={ArrowLeftIcon}
        label="Back"
        onClick={onBack}
        className="md:hidden"
      />
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search people, snaccs, tags"
          autoFocus
          className="h-10 rounded-full pr-10 pl-11 text-base md:text-base [&::-webkit-search-cancel-button]:hidden"
        />
        {value.length > 0 ? (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <XIcon className="size-5" />
          </button>
        ) : null}
      </div>
    </header>
  )
}
