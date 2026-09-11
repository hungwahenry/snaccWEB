import { ArrowLeftIcon, SearchIcon, XIcon } from "lucide-react"
import { useRef } from "react"
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
  const input = useRef<HTMLInputElement>(null)

  const clear = () => {
    onChange("")
    input.current?.focus()
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/90 px-3 backdrop-blur">
      <IconButton
        icon={ArrowLeftIcon}
        label="Back"
        onClick={onBack}
        className="md:hidden"
      />
      <div role="search" className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={input}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur()
            if (event.key === "Escape" && value) {
              event.preventDefault()
              onChange("")
            }
          }}
          placeholder="Search people, snaccs, tags"
          aria-label="Search people, snaccs, tags and campuses"
          enterKeyHint="search"
          autoComplete="off"
          autoFocus
          className="h-10 rounded-full pr-10 pl-11 text-base md:text-base [&::-webkit-search-cancel-button]:hidden"
        />
        {value.length > 0 ? (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear search"
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30"
          >
            <XIcon className="size-5" />
          </button>
        ) : null}
      </div>
    </header>
  )
}
