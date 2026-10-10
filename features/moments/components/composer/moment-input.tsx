import type { KeyboardEvent } from "react"
import { caretTracking } from "@/lib/caret"

export function MomentInput({
  value,
  onChange,
  onCursorChange,
  onKeyDown,
  placeholder,
}: {
  value: string
  onChange: (next: string) => void
  onCursorChange: (cursor: number) => void
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void
  placeholder: string
}) {
  return (
    <textarea
      value={value}
      {...caretTracking(onChange, onCursorChange)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      rows={1}
      autoFocus
      className="field-sizing-content min-h-32 w-full resize-none bg-transparent p-0 text-xl leading-7 font-medium text-foreground outline-none placeholder:text-muted-foreground/50"
    />
  )
}
