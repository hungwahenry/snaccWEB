import { QuotedSnacc } from "@/features/snaccs/components/card/quote/quoted-snacc"
import { QuotedSnaccSkeleton } from "@/features/snaccs/components/card/quote/quoted-snacc-skeleton"
import { QuotedTombstone } from "@/features/snaccs/components/card/quote/quoted-tombstone"
import type { EmbeddedSnacc } from "@/features/snaccs/types"

export function MomentSnaccCanvas({
  snacc,
  failed,
  value,
  onChange,
}: {
  snacc: EmbeddedSnacc | null
  failed: boolean
  value: string
  onChange: (next: string) => void
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
        onChange={(event) => onChange(event.target.value)}
        placeholder="Add a caption"
        rows={1}
        className="field-sizing-content w-full resize-none bg-transparent text-center text-lg leading-7 font-bold text-white outline-none placeholder:text-white/55"
      />
    </div>
  )
}
