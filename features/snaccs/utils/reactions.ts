import type { Snacc, SnaccReaction } from "../types"
import { TOP_REACTIONS_SHOWN } from "./constants"

export function withReaction(snacc: Snacc, emoji: string | null): Snacc {
  const previous = snacc.my_reaction
  if (previous === emoji) return snacc

  return {
    ...snacc,
    my_reaction: emoji,
    reactions_count: Math.max(
      0,
      snacc.reactions_count + countDelta(previous, emoji)
    ),
    reactions: withTop(snacc.reactions, previous, emoji),
  }
}

export function withSummary(
  tallies: SnaccReaction[],
  previous: string | null,
  next: string | null
): SnaccReaction[] {
  return retally(tallies, previous, next, true)
}

function withTop(
  reactions: SnaccReaction[],
  previous: string | null,
  next: string | null
): SnaccReaction[] {
  const complete = reactions.length < TOP_REACTIONS_SHOWN
  return retally(reactions, previous, next, complete).slice(
    0,
    TOP_REACTIONS_SHOWN
  )
}

function countDelta(previous: string | null, next: string | null): number {
  if (previous === null && next !== null) return 1
  if (previous !== null && next === null) return -1
  return 0
}

function retally(
  tallies: SnaccReaction[],
  previous: string | null,
  next: string | null,
  canAdd: boolean
): SnaccReaction[] {
  if (previous === next) return tallies

  const missing =
    next !== null && !tallies.some((tally) => tally.emoji === next)
  const grown =
    missing && canAdd ? [...tallies, { emoji: next, count: 0 }] : tallies

  return grown
    .map((tally) => {
      if (tally.emoji === previous) return { ...tally, count: tally.count - 1 }
      if (tally.emoji === next) return { ...tally, count: tally.count + 1 }
      return tally
    })
    .filter((tally) => tally.count > 0)
    .sort((a, b) => b.count - a.count || a.emoji.localeCompare(b.emoji))
}
