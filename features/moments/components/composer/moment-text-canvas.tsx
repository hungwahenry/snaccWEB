import type { KeyboardEvent } from "react"
import { caretTracking } from "@/lib/caret"

export function MomentTextCanvas({
  value,
  onChange,
  onCursorChange,
  onKeyDown,
}: {
  value: string
  onChange: (next: string) => void
  onCursorChange: (cursor: number) => void
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void
}) {
  return (
    <div className="flex flex-1 items-center justify-center px-6">
      <textarea
        value={value}
        {...caretTracking(onChange, onCursorChange)}
        onKeyDown={onKeyDown}
        placeholder="What's the moment?"
        autoFocus
        rows={1}
        className="field-sizing-content w-full resize-none bg-transparent text-center text-3xl leading-10 font-extrabold text-white outline-none placeholder:text-white/55"
      />
    </div>
  )
}
