import type { Option, StatusMeta } from "@/features/admin/shell/types"
import { plural } from "@/features/admin/shell/utils/format"
import { formatDate, formatNumber, percent } from "@/lib/format"
import type {
  AdminAnnouncement,
  AnnouncementStatus,
  EditorAbilities,
  EditorStage,
  ResultStat,
} from "../types"

export const SENDING_POLL_MS = 3_000

const ANNOUNCEMENT_STATUS: Record<AnnouncementStatus, StatusMeta> = {
  draft: { label: "Draft", variant: "outline" },
  scheduled: { label: "Scheduled", variant: "secondary" },
  sending: { label: "Sending…", variant: "secondary" },
  sent: { label: "Sent", variant: "default" },
}

export const STATUS_FILTERS = [
  "draft",
  "scheduled",
  "sent",
] as const satisfies readonly AnnouncementStatus[]

export const STATUS_OPTIONS: Option<(typeof STATUS_FILTERS)[number]>[] = [
  { value: "draft", label: "Drafts" },
  { value: "scheduled", label: "Scheduled" },
  { value: "sent", label: "Sent" },
]

const IMPORTANT: StatusMeta = { label: "Important", variant: "destructive" }
const BANNER: StatusMeta = { label: "Feed banner", variant: "outline" }
const NO_PUSH: StatusMeta = { label: "No push", variant: "outline" }

export function announcementBadges(
  announcement: Pick<
    AdminAnnouncement,
    "status" | "important" | "banner_until" | "push"
  >,
  now = Date.now()
): StatusMeta[] {
  const banner =
    announcement.banner_until !== null &&
    Date.parse(announcement.banner_until) > now

  return [
    ANNOUNCEMENT_STATUS[announcement.status],
    ...(announcement.important ? [IMPORTANT] : []),
    ...(banner ? [BANNER] : []),
    ...(announcement.push ? [] : [NO_PUSH]),
  ]
}

export function whenLabel(
  announcement: Pick<AdminAnnouncement, "status" | "send_at" | "sent_at">
): string {
  switch (announcement.status) {
    case "sent":
      return formatDate(announcement.sent_at)
    case "sending":
      return "Sending…"
    case "scheduled":
      return `Scheduled for ${formatDate(announcement.send_at)}`
    default:
      return "Draft"
  }
}

export function timelineLabel(
  announcement: Pick<
    AdminAnnouncement,
    "status" | "send_at" | "sent_at" | "created_at"
  >
): string {
  switch (announcement.status) {
    case "sent":
      return `Sent ${formatDate(announcement.sent_at)}`
    case "sending":
      return "Going out now"
    case "scheduled":
      return `Scheduled for ${formatDate(announcement.send_at)}`
    default:
      return `Started ${formatDate(announcement.created_at)}`
  }
}

export function sendingPoll(statuses: AnnouncementStatus[]): number | false {
  return statuses.includes("sending") ? SENDING_POLL_MS : false
}

export function stageOf(
  announcement?: Pick<AdminAnnouncement, "status">
): EditorStage {
  return announcement?.status ?? "new"
}

export const EDITOR_ABILITIES: Record<EditorStage, EditorAbilities> = {
  new: {
    editSetup: true,
    editContent: true,
    send: true,
    unschedule: false,
    remove: false,
    test: true,
  },
  draft: {
    editSetup: true,
    editContent: true,
    send: true,
    unschedule: false,
    remove: true,
    test: true,
  },
  scheduled: {
    editSetup: true,
    editContent: true,
    send: true,
    unschedule: true,
    remove: true,
    test: true,
  },
  sending: {
    editSetup: false,
    editContent: false,
    send: false,
    unschedule: false,
    remove: false,
    test: false,
  },
  sent: {
    editSetup: false,
    editContent: true,
    send: false,
    unschedule: false,
    remove: true,
    test: true,
  },
}

export function saveLabel(stage: EditorStage): string {
  return stage === "new" || stage === "draft" ? "Save draft" : "Save changes"
}

export function scheduleLabel(stage: EditorStage): string {
  return stage === "scheduled" ? "Change time" : "Schedule"
}

export function withDraftNote(
  hint: string,
  stage: EditorStage,
  ready: boolean
): string {
  if (stage !== "new") return hint

  return ready
    ? `${hint} This saves it as a draft first.`
    : `${hint} It needs a finished draft first: a title, a message and nothing in red.`
}

export function counterText(text: string, max: number): string {
  return `${formatNumber(text.length)}/${formatNumber(max)}`
}

export function reachLabel(count: number): string {
  return count === 0
    ? "Reaches nobody right now"
    : `Reaches about ${plural(count, "person", "people")}`
}

export function sendTitle(count: number | undefined): string {
  return count === undefined
    ? "Send it now?"
    : `Send to ${plural(count, "person", "people")} now?`
}

export function percentOf(part: number, whole: number | null): string | null {
  return whole ? percent(part / whole) : null
}

export function countOrDash(count: number | null): string {
  return count === null ? "—" : formatNumber(count)
}

export function openedLabel(
  announcement: Pick<AdminAnnouncement, "status" | "stats" | "recipients_count">
): string {
  if (announcement.status !== "sent") return "—"

  const opened = formatNumber(announcement.stats.opened)
  const share = percentOf(
    announcement.stats.opened,
    announcement.recipients_count
  )

  return share ? `${opened} · ${share}` : opened
}

export function resultStats(announcement: AdminAnnouncement): ResultStat[] {
  const { stats, buttons } = announcement
  const share = percentOf(stats.opened, announcement.recipients_count)
  const taps = Array.from(
    { length: Math.max(buttons.length, stats.taps.length) },
    (_, index): ResultStat => ({
      key: `tap-${index}`,
      label: `Tapped “${buttons[index]?.label ?? `Button ${index + 1}`}”`,
      value: formatNumber(stats.taps[index] ?? 0),
    })
  )
  const banner =
    announcement.banner_until !== null || stats.dismissed > 0
      ? [
          {
            key: "dismissed",
            label: "Dismissed the banner",
            value: formatNumber(stats.dismissed),
          },
        ]
      : []

  return [
    {
      key: "reached",
      label: "Reached",
      value: countOrDash(announcement.recipients_count),
    },
    {
      key: "opened",
      label: "Opened",
      value: formatNumber(stats.opened),
      hint: share ? `${share} of reached` : undefined,
    },
    ...taps,
    ...banner,
  ]
}
