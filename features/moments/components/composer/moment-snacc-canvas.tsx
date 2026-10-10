import type { KeyboardEvent } from "react"
import { QuotedSnacc } from "@/features/snaccs/components/card/quote/quoted-snacc"
import { QuotedSnaccSkeleton } from "@/features/snaccs/components/card/quote/quoted-snacc-skeleton"
import { QuotedTombstone } from "@/features/snaccs/components/card/quote/quoted-tombstone"
import type { EmbeddedSnacc } from "@/features/snaccs/types"
import { caretTracking } from "@/lib/caret"

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
    <div className="flex flex-1 flex-col justify-center gap-6 px-6">
      <div className="overflow-hidden rounded-2xl bg-background">
        {snacc ? (
          <QuotedSnacc snacc={snacc} />
        ) : failed ? (
          <QuotedTombstone reason="unavailable" />
        ) : (
          <QuotedSnaccSkeleton />
        )}
      </div>

      <textarea
        value={value}
        {...caretTracking(onChange, onCursorChange)}
        onKeyDown={onKeyDown}
        placeholder="Add a caption"
        rows={1}
        className="field-sizing-content w-full resize-none bg-transparent text-center text-lg leading-7 font-bold text-white outline-none placeholder:text-white/55"
      />
    </div>
  )
}
