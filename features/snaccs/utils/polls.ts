import { countLabel } from "@/lib/format"
import type {
  PollDraft,
  PollGalleryImage,
  PollOptionDraft,
  PollPayload,
  SnaccPoll,
  SnaccPollOption,
} from "../types"

export const MINUTES_PER_DAY = 1440
export const MINUTE_STEP = 5

const FRESH_OPTION: PollOptionDraft = { text: "", image: null }

export const FRESH_POLL: PollDraft = {
  options: [FRESH_OPTION, FRESH_OPTION],
  days: 1,
  hours: 0,
  minutes: 0,
}

export const MIN_POLL_OPTIONS = 2

export function pollRevealed(poll: SnaccPoll): boolean {
  return poll.closed || poll.my_option_id !== null
}

export function optionShare(option: SnaccPollOption, poll: SnaccPoll): number {
  const total = poll.total_votes ?? 0
  if (total === 0 || option.votes_count === null) return 0
  return option.votes_count / total
}

export function pollTimeLeft(closesAt: string, now = Date.now()): string {
  const ms = new Date(closesAt).getTime() - now
  if (ms <= 0) return "Final results"

  const minutes = Math.ceil(ms / 60_000)
  if (minutes < 60) return `${minutes}m left`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h left`
  return `${Math.floor(hours / 24)}d left`
}

export function pollFooter(poll: SnaccPoll, now = Date.now()): string {
  const clock = pollTimeLeft(poll.closes_at, now)
  if (!pollRevealed(poll) || poll.total_votes === null) return clock
  return `${countLabel(poll.total_votes, "vote")} · ${clock}`
}

/** The options that have a picture, in order, and where the tapped one sits among them. */
export function pollGallery(
  poll: SnaccPoll,
  optionId: string
): { images: PollGalleryImage[]; index: number } | null {
  const pictured = poll.options.filter((option) => option.image !== null)
  const index = pictured.findIndex((option) => option.id === optionId)
  if (index < 0) return null

  return {
    images: pictured.map((option) => ({
      url: option.image!.url,
      width: option.image!.width,
      height: option.image!.height,
    })),
    index,
  }
}

export function pollMinutes(
  poll: Pick<PollDraft, "days" | "hours" | "minutes">
): number {
  return poll.days * MINUTES_PER_DAY + poll.hours * 60 + poll.minutes
}

function filledOptions(poll: PollDraft): PollOptionDraft[] {
  return poll.options.filter((option) => option.text.trim().length > 0)
}

export function pollHasDuplicate(poll: PollDraft): boolean {
  const labels = filledOptions(poll).map((option) =>
    option.text.trim().toLowerCase()
  )
  return new Set(labels).size !== labels.length
}

export interface PollLimits {
  optionMaxLength: number
  minMinutes: number
  maxMinutes: number
}

export function pollIsValid(poll: PollDraft, limits: PollLimits): boolean {
  const filled = filledOptions(poll)
  const pictured = filled.filter((option) => option.image !== null).length
  const minutes = pollMinutes(poll)

  return (
    filled.length >= MIN_POLL_OPTIONS &&
    filled.every(
      (option) => option.text.trim().length <= limits.optionMaxLength
    ) &&
    !pollHasDuplicate(poll) &&
    (pictured === 0 || pictured === filled.length) &&
    minutes >= limits.minMinutes &&
    minutes <= limits.maxMinutes
  )
}

function spanLabel(minutes: number): string {
  if (minutes % MINUTES_PER_DAY === 0)
    return countLabel(minutes / MINUTES_PER_DAY, "day")
  if (minutes % 60 === 0) return countLabel(minutes / 60, "hour")
  return countLabel(minutes, "minute")
}

/** Why a poll can't go out yet, for anything the form itself doesn't make obvious. */
export function pollProblem(
  poll: PollDraft,
  limits: PollLimits
): string | null {
  if (pollHasDuplicate(poll)) return "Every option has to be different."

  const filled = filledOptions(poll)
  const pictured = filled.filter((option) => option.image !== null).length
  if (pictured > 0 && pictured !== filled.length)
    return "Give every option a picture, or none of them."

  const minutes = pollMinutes(poll)
  if (minutes < limits.minMinutes)
    return `A poll has to run for at least ${spanLabel(limits.minMinutes)}.`
  if (minutes > limits.maxMinutes)
    return `A poll can run for ${spanLabel(limits.maxMinutes)} at most.`

  return null
}

export function toPollPayload(poll: PollDraft): PollPayload {
  const filled = filledOptions(poll)
  return {
    options: filled.map((option) => option.text.trim()),
    images: filled.every((option) => option.image !== null)
      ? filled.map((option) => option.image!)
      : undefined,
    durationMinutes: pollMinutes(poll),
  }
}

export function withOption(
  poll: PollDraft,
  index: number,
  patch: Partial<PollOptionDraft>
): PollDraft {
  return {
    ...poll,
    options: poll.options.map((option, at) =>
      at === index ? { ...option, ...patch } : option
    ),
  }
}

export function withAddedOption(
  poll: PollDraft,
  maxOptions: number
): PollDraft {
  return poll.options.length < maxOptions
    ? { ...poll, options: [...poll.options, FRESH_OPTION] }
    : poll
}

export function withoutOption(poll: PollDraft, index: number): PollDraft {
  return poll.options.length > MIN_POLL_OPTIONS
    ? { ...poll, options: poll.options.filter((_, at) => at !== index) }
    : poll
}

function range(from: number, to: number, step = 1): number[] {
  const values: number[] = []
  for (let value = from; value <= to; value += step) values.push(value)
  return values
}

/** The choices each duration picker offers, as far as the longest poll allowed. */
export function durationChoices(maxMinutes: number): {
  days: number[]
  hours: number[]
  minutes: number[]
} {
  return {
    days: range(0, Math.floor(maxMinutes / MINUTES_PER_DAY)),
    hours: range(0, 23),
    minutes: range(0, 55, MINUTE_STEP),
  }
}

export function optionPlaceholder(index: number): string {
  return index >= MIN_POLL_OPTIONS
    ? `Option ${index + 1} (optional)`
    : `Option ${index + 1}`
}
