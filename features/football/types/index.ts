export type MatchStatus = "upcoming" | "live" | "halftime" | "finished" | "off"

export interface MatchTeam {
  name: string
  code: string | null
  crest: string | null
}

export interface LiveMatch {
  id: string
  competition: { code: string; name: string; emblem: string | null }
  home: MatchTeam
  away: MatchTeam
  status: MatchStatus
  kickoff_at: string
  home_score: number | null
  away_score: number | null
}

export interface Scoreboard {
  matches: LiveMatch[]
  updated_at: string | null
}

export interface FormRow {
  result: "W" | "D" | "L"
  opponent: string
  score: string
  kickoff_at: string
}

export interface PastMeeting {
  id: string
  kickoff_at: string
  home: string
  away: string
  home_score: number | null
  away_score: number | null
}

export interface TableSlot {
  position: number
  points: number
  played: number
}

export interface MatchDetail {
  match: LiveMatch
  halftime: { home: number; away: number } | null
  matchday: number | null
  h2h: {
    played: number
    home_wins: number
    draws: number
    away_wins: number
    total_goals: number
    meetings: PastMeeting[]
  } | null
  form: { home: FormRow[]; away: FormRow[] }
  standings: { home: TableSlot | null; away: TableSlot | null } | null
}

/**
 * A match as it hangs off a snacc. Copied at post time, then refreshed from the scoreboard while
 * the game is still on — `live` says which of the two you are looking at.
 */
export interface SnaccMatch {
  match_id: string
  competition: string
  home: { name: string; crest: string | null }
  away: { name: string; crest: string | null }
  kickoff_at: string
  home_score: number | null
  away_score: number | null
  status: MatchStatus
  live: boolean
}

/** How many snaccs each of today's fixtures has, keyed by match id. */
export type MatchSnaccCounts = Record<string, number>
