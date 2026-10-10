import { QuotedSnacc } from "@/features/snaccs/components/card/quote/quoted-snacc"
import { QuotedTombstone } from "@/features/snaccs/components/card/quote/quoted-tombstone"
import type { Moment } from "../types"

export function MomentSharedSnacc({
  moment,
  onOpen,
}: {
  moment: Pick<Moment, "snacc" | "snacc_gone">
  onOpen: (snaccId: string) => void
}) {
  const { snacc, snacc_gone: gone } = moment

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-center px-6">
      <div className="pointer-events-auto overflow-hidden rounded-2xl bg-background">
        {snacc ? (
          <QuotedSnacc snacc={snacc} onPress={() => onOpen(snacc.id)} />
        ) : gone ? (
          <QuotedTombstone reason={gone} />
        ) : null}
      </div>
    </div>
  )
}
