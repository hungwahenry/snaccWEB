import { Eyebrow } from "@/components/ui/eyebrow"
import { clockTime } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { LiveMatch, MatchTeam } from "../types"

function Crest({ url, size }: { url: string | null; size: number }) {
  if (!url)
    return (
      <span
        className="shrink-0 rounded-full bg-border"
        style={{ width: size, height: size }}
      />
    )
  return (
    <img
      src={url}
      alt=""
      width={size}
      height={size}
      className="shrink-0 object-contain"
    />
  )
}

function TeamRow({
  team,
  score,
  playing,
}: {
  team: MatchTeam
  score: number | null
  playing: boolean
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Crest url={team.crest} size={24} />
      <span className="flex-1 truncate text-base font-bold text-foreground">
        {team.code ?? team.name}
      </span>
      {score !== null ? (
        <span
          className={cn(
            "text-base",
            playing
              ? "font-extrabold text-foreground"
              : "font-bold text-muted-foreground"
          )}
        >
          {score}
        </span>
      ) : null}
    </div>
  )
}

export function LiveBadge({ size = "sm" }: { size?: "sm" | "md" }) {
  return (
    <span className="flex items-center gap-1">
      <span className="size-1.5 rounded-full bg-red-500" />
      <span
        className={cn(
          "font-extrabold tracking-wider text-red-500",
          size === "sm" ? "text-[10px]" : "text-[11px]"
        )}
      >
        LIVE
      </span>
    </span>
  )
}

function StatusBadge({ match }: { match: LiveMatch }) {
  if (match.status === "live") return <LiveBadge />
  const label =
    match.status === "halftime"
      ? "HT"
      : match.status === "finished"
        ? "FT"
        : clockTime(match.kickoff_at)
  return (
    <span className="text-[10px] font-bold tracking-wider text-muted-foreground">
      {label}
    </span>
  )
}

function MatchCard({
  match,
  onPress,
}: {
  match: LiveMatch
  onPress: () => void
}) {
  const playing = match.status === "live" || match.status === "halftime"

  return (
    <button
      type="button"
      onClick={onPress}
      className="flex w-[220px] shrink-0 flex-col gap-3 rounded-2xl bg-muted p-4 text-left transition-opacity active:opacity-70"
    >
      <div className="flex items-center justify-between">
        <span className="flex flex-1 items-center gap-1.5">
          <Crest url={match.competition.emblem} size={15} />
          <span className="flex-1 truncate text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
            {match.competition.code || match.competition.name}
          </span>
        </span>
        <StatusBadge match={match} />
      </div>
      <TeamRow team={match.home} score={match.home_score} playing={playing} />
      <TeamRow team={match.away} score={match.away_score} playing={playing} />
    </button>
  )
}

export function Matchday({
  matches,
  onPressMatch,
}: {
  matches: LiveMatch[]
  onPressMatch: (match: LiveMatch) => void
}) {
  if (matches.length === 0) return null

  return (
    <div className="flex flex-col gap-2.5">
      <Eyebrow className="px-6">Matchday</Eyebrow>
      <div className="flex [scrollbar-width:none] gap-2.5 overflow-x-auto px-6 [&::-webkit-scrollbar]:hidden">
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            onPress={() => onPressMatch(match)}
          />
        ))}
      </div>
    </div>
  )
}
