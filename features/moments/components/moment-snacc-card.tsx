import { QuotedSnacc } from "@/features/snaccs/components/card/quote/quoted-snacc"
import { QuotedSnaccSkeleton } from "@/features/snaccs/components/card/quote/quoted-snacc-skeleton"
import { QuotedTombstone } from "@/features/snaccs/components/card/quote/quoted-tombstone"
import type { EmbeddedSnacc, QuotedGone } from "@/features/snaccs/types"

export function MomentSnaccCard({
  snacc,
  gone,
}: {
  snacc: EmbeddedSnacc | null
  gone: QuotedGone | null
}) {
  return (
    <div className="pointer-events-none max-h-[55dvh] overflow-hidden rounded-2xl bg-background">
      {snacc ? (
        <QuotedSnacc snacc={snacc} frameless />
      ) : gone ? (
        <QuotedTombstone reason={gone} />
      ) : (
        <QuotedSnaccSkeleton />
      )}
    </div>
  )
}
