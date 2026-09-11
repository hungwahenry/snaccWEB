import type { LiveMatch, SnaccMatch } from "../types"

/**
 * A board fixture in the shape a snacc card expects, for previewing before the snacc exists.
 * Marked live because it came straight off the board — the server takes its own copy on post.
 */
export function liveMatchCard(match: LiveMatch): SnaccMatch {
  return {
    match_id: match.id,
    competition: match.competition.name,
    home: { name: match.home.name, crest: match.home.crest },
    away: { name: match.away.name, crest: match.away.crest },
    kickoff_at: match.kickoff_at,
    home_score: match.home_score,
    away_score: match.away_score,
    status: match.status,
    live: true,
  }
}

/** A fixture in one line: "Arsenal 2–1 Chelsea", or "Arsenal vs Chelsea" before kickoff. */
export function matchLine(
  match: Pick<SnaccMatch, "home" | "away" | "home_score" | "away_score">
): string {
  if (match.home_score === null || match.away_score === null) {
    return `${match.home.name} vs ${match.away.name}`
  }
  return `${match.home.name} ${match.home_score}–${match.away_score} ${match.away.name}`
}
