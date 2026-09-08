import type { SnaccPoll, SnaccPollOption } from "../types"

export function pollRevealed(poll: SnaccPoll): boolean {
  return poll.closed || poll.my_option_id !== null
}

export function optionShare(option: SnaccPollOption, poll: SnaccPoll): number {
  const total = poll.total_votes ?? 0
  if (total === 0 || option.votes_count === null) return 0
  return option.votes_count / total
}

export function pollTimeLeft(closesAt: string): string {
  const ms = new Date(closesAt).getTime() - Date.now()
  if (ms <= 0) return "Final results"

  const minutes = Math.ceil(ms / 60_000)
  if (minutes < 60) return `${minutes}m left`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h left`
  return `${Math.floor(hours / 24)}d left`
}

export function pollFooter(poll: SnaccPoll): string {
  const clock = pollTimeLeft(poll.closes_at)
  if (!pollRevealed(poll) || poll.total_votes === null) return clock

  const noun = poll.total_votes === 1 ? "vote" : "votes"
  return `${poll.total_votes} ${noun} · ${clock}`
}
