import { SearchIcon, XIcon } from "lucide-react"
import { IconButton } from "@/components/ui/icon-button"
import { Input } from "@/components/ui/input"

export interface PickerSearchProps {
  value: string
  placeholder: string
  active: boolean
  onChange: (value: string) => void
  onFocus: () => void
  onClear: () => void
}

export function PickerSearch({
  value,
  placeholder,
  active,
  onChange,
  onFocus,
  onClear,
}: PickerSearchProps) {
  return (
    <div className="px-4 pt-3 pb-2">
      <div className="relative">
        <SearchIcon
          aria-hidden
          className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={onFocus}
          onKeyDown={(event) => {
            if (event.key === "Escape" && active) {
              event.stopPropagation()
              onClear()
            }
          }}
          placeholder={placeholder}
          aria-label={placeholder}
          autoCapitalize="none"
          autoCorrect="off"
          enterKeyHint="search"
          className="h-12 rounded-full pr-12 pl-11 text-base md:text-base [&::-webkit-search-cancel-button]:hidden"
        />
        {active ? (
          <IconButton
            icon={XIcon}
            label="Stop searching"
            onClick={onClear}
            className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground"
            iconClassName="size-4"
          />
        ) : null}
      </div>
    </div>
  )
}
