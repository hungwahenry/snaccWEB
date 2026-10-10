import type { KeyboardEvent } from "react"
import type { EmbeddedSnacc } from "@/features/snaccs/types"
import { caretTracking } from "@/lib/caret"
import { MomentSnaccCard } from "../moment-snacc-card"

export function MomentSnaccCanvas({
  snacc,
  failed,
  value,
  onChange,
  onCursorChange,
  onKeyDown,
}: {
  snacc: EmbeddedSnacc | null
  failed: boolean
  value: string
  onChange: (next: string) => void
  onCursorChange: (cursor: number) => void
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col justify-center px-6">
        <MomentSnaccCard snacc={snacc} gone={failed ? "unavailable" : null} />
      </div>

      <div className="bg-black/45 px-5 py-4">
        <textarea
          value={value}
          {...caretTracking(onChange, onCursorChange)}
          onKeyDown={onKeyDown}
          placeholder="Add a caption"
          rows={1}
          className="field-sizing-content w-full resize-none bg-transparent text-base leading-6 font-medium text-white outline-none placeholder:text-white/55"
        />
      </div>
    </div>
  )
}
