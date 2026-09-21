import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { Eyebrow } from "@/components/ui/eyebrow"
import { snaccPath } from "@/features/snaccs/routes"
import { cn } from "@/lib/utils"
import type { HangoutCard, SnaccHangout } from "../../types"
import { goingLine, whenLine } from "../../utils/hangouts"

const TILE =
  "flex w-44 shrink-0 flex-col gap-2 rounded-2xl border border-border p-3"

function HangoutTile({
  href,
  hangout,
  now,
}: {
  href: string
  hangout: SnaccHangout
  now: number
}) {
  return (
    <Link
      href={href}
      className={cn(TILE, "transition-colors hover:bg-muted/50")}
    >
      <span
        aria-hidden
        className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-xl"
      >
        {hangout.emoji}
      </span>
      <span className="line-clamp-2 text-sm font-extrabold text-foreground">
        {hangout.title}
      </span>
      <span className="flex flex-col gap-0.5 text-xs text-muted-foreground">
        <span className="truncate">{whenLine(hangout, now)}</span>
        <span>{goingLine(hangout)}</span>
      </span>
    </Link>
  )
}

export function HangoutsStrip({
  cards,
  now,
  seeAllHref,
  onPlan,
  className,
}: {
  cards: HangoutCard[]
  now: number
  seeAllHref: string
  onPlan?: () => void
  className?: string
}) {
  return (
    <section className={cn("flex flex-col gap-2.5 py-2", className)}>
      <div className="flex items-center justify-between px-4">
        <Eyebrow>Hangouts on campus</Eyebrow>
        <Link
          href={seeAllHref}
          className="text-sm font-bold text-foreground hover:underline"
        >
          See all
        </Link>
      </div>
      <div className="flex [scrollbar-width:none] gap-3 overflow-x-auto px-4 [&::-webkit-scrollbar]:hidden">
        {cards.map((card) =>
          card.snacc.hangout ? (
            <HangoutTile
              key={card.id}
              href={snaccPath(card.snacc.id)}
              hangout={card.snacc.hangout}
              now={now}
            />
          ) : null
        )}
        {onPlan ? (
          <button
            type="button"
            onClick={onPlan}
            className={cn(
              TILE,
              "items-center justify-center border-dashed text-center transition-colors hover:bg-muted/50"
            )}
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-muted">
              <PlusIcon className="size-5 text-foreground" />
            </span>
            <span className="text-sm font-bold text-foreground">
              Plan a hangout
            </span>
            <span className="text-xs text-muted-foreground">
              Watch a game, study, grab food
            </span>
          </button>
        ) : null}
      </div>
    </section>
  )
}
