import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useFlag } from "@/features/config/hooks/use-flag"
import { composePath } from "@/features/snaccs/routes"
import { matchRoomPath } from "../routes"
import { ActionSheet } from "@/components/ui/action-sheet"
import { Eyebrow } from "@/components/ui/eyebrow"
import { clockTime, shortDate } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { FormRow, MatchDetail, MatchTeam, TableSlot } from "../types"
import { MatchDetailSkeleton } from "./match-detail-skeleton"
import { LiveBadge } from "./matchday"

const shortName = (team: MatchTeam) => team.code ?? team.name

function TeamBadge({ team }: { team: MatchTeam }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-2">
      {team.crest ? (
        <img
          src={team.crest}
          alt=""
          width={44}
          height={44}
          className="object-contain"
        />
      ) : (
        <span className="size-11 rounded-full bg-border" />
      )}
      <span className="w-full truncate text-center text-sm font-bold text-foreground">
        {team.name}
      </span>
    </div>
  )
}

function ScoreHeader({ detail }: { detail: MatchDetail }) {
  const { match, halftime } = detail
  const playing = match.status === "live" || match.status === "halftime"
  const settled = match.status === "finished"

  return (
    <div className="flex w-full items-center">
      <TeamBadge team={match.home} />
      <div className="flex flex-col items-center gap-1 px-3">
        {playing || settled ? (
          <span className="text-4xl font-extrabold tracking-tight text-foreground">
            {match.home_score ?? 0} – {match.away_score ?? 0}
          </span>
        ) : (
          <span className="text-3xl font-extrabold text-foreground">
            {clockTime(match.kickoff_at)}
          </span>
        )}
        {match.status === "live" ? (
          <LiveBadge size="md" />
        ) : (
          <span className="text-[11px] font-bold tracking-wider text-muted-foreground">
            {match.status === "halftime"
              ? "HALF TIME"
              : settled
                ? "FULL TIME"
                : shortDate(match.kickoff_at)}
          </span>
        )}
        {halftime && (playing || settled) ? (
          <span className="text-xs text-muted-foreground">
            HT {halftime.home}–{halftime.away}
          </span>
        ) : null}
      </div>
      <TeamBadge team={match.away} />
    </div>
  )
}

const RESULT_STYLE: Record<FormRow["result"], { chip: string; text: string }> =
  {
    W: { chip: "bg-green-500/15", text: "text-green-500" },
    D: { chip: "bg-muted", text: "text-muted-foreground" },
    L: { chip: "bg-red-500/15", text: "text-red-500" },
  }

function FormStrip({ label, rows }: { label: string; rows: FormRow[] }) {
  if (rows.length === 0) return null

  return (
    <div className="flex items-center gap-2">
      <span className="w-14 truncate text-sm font-bold text-foreground">
        {label}
      </span>
      <div className="flex gap-1.5">
        {rows.map((row) => (
          <span
            key={row.kickoff_at + row.opponent}
            className={cn(
              "flex size-7 items-center justify-center rounded-full text-xs font-extrabold",
              RESULT_STYLE[row.result].chip,
              RESULT_STYLE[row.result].text
            )}
          >
            {row.result}
          </span>
        ))}
      </div>
    </div>
  )
}

function TableRow({ team, slot }: { team: MatchTeam; slot: TableSlot }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-8 text-sm font-extrabold text-muted-foreground">
        #{slot.position}
      </span>
      <span className="flex-1 truncate text-sm font-bold text-foreground">
        {team.name}
      </span>
      <span className="text-sm text-muted-foreground">
        {slot.points} pts · {slot.played} played
      </span>
    </div>
  )
}

export function MatchDetailSheet({
  open,
  onOpenChange,
  detail,
  loading,
  failed,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  detail: MatchDetail | null
  loading: boolean
  failed: boolean
}) {
  const canPost = useFlag("snacc_matches")

  return (
    <ActionSheet
      open={open}
      onOpenChange={onOpenChange}
      title={
        detail
          ? `${shortName(detail.match.home)} vs ${shortName(detail.match.away)}`
          : "Match"
      }
      hint={
        detail
          ? detail.matchday
            ? `${detail.match.competition.name} · Matchday ${detail.matchday}`
            : detail.match.competition.name
          : loading
            ? " "
            : undefined
      }
      tall
      className="px-5 pb-6"
    >
      {!detail ? (
        failed ? (
          <div className="flex justify-center py-16">
            <p className="text-muted-foreground">Could not load this match.</p>
          </div>
        ) : loading ? (
          <MatchDetailSkeleton />
        ) : null
      ) : (
        <div className="flex flex-col gap-6 pt-2">
          <ScoreHeader detail={detail} />

          {/* The way in: the sheet is where somebody is already looking at this match. */}
          {canPost ? (
            <div className="flex gap-2">
              <Button
                className="flex-1"
                render={
                  <Link href={composePath({ matchId: detail.match.id })} />
                }
              >
                Snacc about this
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                render={<Link href={matchRoomPath(detail.match.id)} />}
              >
                See the room
              </Button>
            </div>
          ) : null}

          {detail.form.home.length > 0 || detail.form.away.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              <Eyebrow>Form</Eyebrow>
              <FormStrip
                label={shortName(detail.match.home)}
                rows={detail.form.home}
              />
              <FormStrip
                label={shortName(detail.match.away)}
                rows={detail.form.away}
              />
            </div>
          ) : null}

          {detail.h2h && detail.h2h.played > 0 ? (
            <div className="flex flex-col gap-2.5">
              <Eyebrow>Head to head</Eyebrow>
              <p className="text-sm text-muted-foreground">
                {detail.h2h.played} meetings · {shortName(detail.match.home)}{" "}
                {detail.h2h.home_wins} · {detail.h2h.draws} drawn ·{" "}
                {shortName(detail.match.away)} {detail.h2h.away_wins} ·{" "}
                {detail.h2h.total_goals} goals
              </p>
              <div className="flex flex-col gap-1.5">
                {detail.h2h.meetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-muted-foreground">
                      {shortDate(meeting.kickoff_at)}
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {meeting.home} {meeting.home_score ?? "–"}–
                      {meeting.away_score ?? "–"} {meeting.away}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {detail.standings?.home || detail.standings?.away ? (
            <div className="flex flex-col gap-2.5">
              <Eyebrow>Standings</Eyebrow>
              {detail.standings.home ? (
                <TableRow
                  team={detail.match.home}
                  slot={detail.standings.home}
                />
              ) : null}
              {detail.standings.away ? (
                <TableRow
                  team={detail.match.away}
                  slot={detail.standings.away}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      )}
    </ActionSheet>
  )
}
