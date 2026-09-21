import { roundUpToStep } from "@/lib/calendar"
import { clockTime, countLabel, dateAtTime, weekdayDate } from "@/lib/format"
import type { ScheduledSnacc } from "../types"

export const SLOT_MINUTES = 5
export const DEFAULT_LEAD_MINUTES = 60
const MINUTE_MS = 60_000

export function nextSlot(now: Date, aheadMinutes = DEFAULT_LEAD_MINUTES): Date {
  return roundUpToStep(
    new Date(now.getTime() + aheadMinutes * MINUTE_MS),
    SLOT_MINUTES
  )
}

export function scheduleWindow(
  now: Date,
  minLeadMinutes: number,
  maxLeadDays: number
): { min: Date; max: Date } {
  return {
    min: new Date(now.getTime() + minLeadMinutes * MINUTE_MS),
    max: new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + Math.max(1, maxLeadDays) - 1,
      23,
      60 - SLOT_MINUTES
    ),
  }
}

export function isTooSoon(
  at: Date,
  now: Date,
  minLeadMinutes: number
): boolean {
  return at.getTime() < now.getTime() + minLeadMinutes * MINUTE_MS
}

export function tooSoonMessage(minLeadMinutes: number): string {
  return `Pick a time at least ${countLabel(minLeadMinutes, "minute")} from now.`
}

export function goesOutLabel(iso: string): string {
  return `${weekdayDate(iso)}, ${clockTime(iso)}`
}

export function goesOutSentence(iso: string): string {
  return dateAtTime(iso)
}

export function rescheduleSeed(
  publishAt: string,
  now: Date,
  minLeadMinutes: number
): Date {
  const at = roundUpToStep(new Date(publishAt), SLOT_MINUTES)
  return isTooSoon(at, now, minLeadMinutes) ? nextSlot(now) : at
}

export function scheduledThumb(
  item: Pick<ScheduledSnacc, "images" | "gif" | "sticker">
): { url: string; sticker: boolean } | null {
  const image = item.images[0]
  if (image) return { url: image.thumb_url || image.url, sticker: false }
  if (item.gif)
    return { url: item.gif.preview_url ?? item.gif.url, sticker: false }
  if (item.sticker)
    return { url: item.sticker.preview_url ?? item.sticker.url, sticker: true }
  return null
}

export function scheduledPreview(
  item: Pick<
    ScheduledSnacc,
    "body" | "voice" | "poll" | "images" | "gif" | "sticker"
  >
): string {
  const body = item.body?.trim()
  if (body) return body
  if (item.voice) return "Voice note"
  if (item.poll) return "Poll"
  if (item.images.length > 0) return "Photo"
  if (item.gif) return "GIF"
  if (item.sticker) return "Sticker"
  return ""
}

export function scheduledLine(
  item: Pick<ScheduledSnacc, "status" | "failure" | "publish_at">
): { text: string; failed: boolean } {
  if (item.status === "failed")
    return {
      text: item.failure
        ? `Could not go out: ${item.failure}`
        : "Could not go out.",
      failed: true,
    }
  return { text: `Goes out ${goesOutLabel(item.publish_at)}`, failed: false }
}
