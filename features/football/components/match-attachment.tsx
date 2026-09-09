import Link from "next/link"
import { clockTime } from "@/lib/format"
import { cn } from "@/lib/utils"
import { matchRoomPath } from "../routes"
import type { SnaccMatch } from "../types"

function Crest({ url }: { url: string | null }) {
  if (!url) return <span className="size-6 shrink-0 rounded-full bg-border" />

  return (
    <img
      src={url}
      alt=""
      width={24}
      height={24}
      className="size-6 shrink-0 object-contain"
    />
  )
}

function Side({
  name,
  crest,
  score,
  bold,
}: {
  name: string
  crest: string | null
  score: number | null
  bold: boolean
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Crest url={crest} />
      <span className="flex-1 truncate text-[15px] font-bold">{name}</span>
      {score !== null ? (
        <span
          className={cn(
            "text-[15px] tabular-nums",
            bold ? "font-extrabold" : "font-bold text-muted-foreground"
          )}
        >
          {score}
        </span>
      ) : null}
    </div>
  )
}

function Status({ match }: { match: SnaccMatch }) {
  if (match.status === "live" || match.status === "halftime") {
    return (
      <span className="flex items-center gap-1">
        <span className="size-1.5 rounded-full bg-red-500" />
        <span className="text-[10px] font-extrabold tracking-wider text-red-500">
          {match.status === "halftime" ? "HT" : "LIVE"}
        </span>
      </span>
    )
  }

  return (
    <span className="text-[10px] font-bold tracking-wider text-muted-foreground">
      {match.status === "finished" ? "FT" : clockTime(match.kickoff_at)}
    </span>
  )
}

/**
 * The match a snacc is about. Tapping it opens the room — everyone else talking about the same
 * game, from every campus — which is the point of attaching one in the first place.
 */
export function MatchAttachment({
  match,
  interactive = true,
}: {
  match: SnaccMatch
  interactive?: boolean
}) {
  const playing = match.status === "live" || match.status === "halftime"

  const body = (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
          {match.competition}
        </span>
        <Status match={match} />
      </div>
      <Side
        name={match.home.name}
        crest={match.home.crest}
        score={match.home_score}
        bold={playing}
      />
      <Side
        name={match.away.name}
        crest={match.away.crest}
        score={match.away_score}
        bold={playing}
      />
    </>
  )

  const shell = "flex flex-col gap-2.5 rounded-2xl border border-border p-3.5"

  if (!interactive) return <div className={shell}>{body}</div>

  return (
    <Link
      href={matchRoomPath(match.match_id)}
      className={cn(shell, "transition-colors hover:bg-muted/50")}
    >
      {body}
    </Link>
  )
}
