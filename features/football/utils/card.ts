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
