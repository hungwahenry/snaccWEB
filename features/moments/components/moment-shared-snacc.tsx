import type { Moment } from "../types"
import { MomentSnaccCard } from "./moment-snacc-card"

export function MomentSharedSnacc({
  moment,
  onOpen,
}: {
  moment: Pick<Moment, "snacc" | "snacc_gone">
  onOpen: (snaccId: string) => void
}) {
  const { snacc, snacc_gone: gone } = moment
  const card = <MomentSnaccCard snacc={snacc} gone={gone} />

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-center px-6">
      {snacc ? (
        <div
          role="link"
          tabIndex={0}
          aria-label="Open the snacc"
          onClick={() => onOpen(snacc.id)}
          onKeyDown={(event) => {
            if (event.key === "Enter") onOpen(snacc.id)
          }}
          className="pointer-events-auto cursor-pointer"
        >
          {card}
        </div>
      ) : (
        card
      )}
    </div>
  )
}
