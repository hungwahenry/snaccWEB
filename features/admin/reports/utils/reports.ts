import type { Option } from "@/features/admin/shell/types"
import {
  EMPTY_SUSPENSION,
  toSuspendInput,
} from "@/features/admin/suspension-reasons/utils/suspension"
import { formatDate, handleOf } from "@/lib/format"
import type {
  AdminReport,
  ReportAct,
  ReportScan,
  ReportTarget,
  ReportTargetType,
  ResolveDraft,
  ResolveReportInput,
} from "../types"

const TARGET_ARTICLE: Record<ReportTargetType, string> = {
  snacc: "a snacc",
  user: "an account",
  message: "a ghost message",
  moment: "a moment",
  chat_message: "a room message",
}

const TARGET_NOUN: Record<ReportTargetType, string> = {
  snacc: "snacc",
  user: "user",
  message: "message",
  moment: "moment",
  chat_message: "room message",
}

const PREVIEW_LENGTH = 60

export function targetSummary(target: ReportTarget): string {
  return target
    ? `Filed against ${TARGET_ARTICLE[target.type]}.`
    : "The reported thing no longer exists."
}

export function targetNoun(target: ReportTarget): string {
  return target ? TARGET_NOUN[target.type] : "target"
}

/** What a reports row shows for its target: a line of its text, and whose it is. */
export function describeTarget(target: ReportTarget): {
  title: string
  who: string
} {
  if (!target) return { title: "Target is gone", who: "—" }

  switch (target.type) {
    case "snacc":
      return {
        title: target.snacc.body?.slice(0, PREVIEW_LENGTH) || "Media snacc",
        who: handleOf(target.snacc.author),
      }
    case "user":
      return { title: "The account itself", who: handleOf(target.user) }
    case "moment":
      return {
        title: target.moment.body?.slice(0, PREVIEW_LENGTH) || "Photo moment",
        who: handleOf(target.moment.author),
      }
    case "chat_message":
      return {
        title:
          target.chat_message.body?.slice(0, PREVIEW_LENGTH) || "Room message",
        who: `${handleOf(target.chat_message.sender)} in ${target.chat_message.room.name}`,
      }
    case "message":
      return {
        title: target.message.body?.slice(0, PREVIEW_LENGTH) || "Ghost message",
        who: handleOf(target.message.sender),
      }
  }
}

/** The first picture attached to the target, for a thumbnail. */
export function targetThumb(target: ReportTarget): string | null {
  if (!target || target.type === "user") return null

  const content =
    target.type === "snacc"
      ? target.snacc
      : target.type === "moment"
        ? target.moment
        : target.type === "chat_message"
          ? target.chat_message
          : target.message

  return (
    content.images[0]?.url ?? content.gif?.url ?? content.sticker?.url ?? null
  )
}

/** Who filed it: their handle, or Snacc itself for the automatic check. */
export function reporterName(report: Pick<AdminReport, "reporter">): string {
  return report.reporter ? handleOf(report.reporter) : "Snacc"
}

export function reviewerName(report: Pick<AdminReport, "reviewed_by">): string {
  return report.reviewed_by?.username
    ? `@${report.reviewed_by.username}`
    : "resolved"
}

export function resolvedLine(
  report: Pick<AdminReport, "reviewed_by" | "reviewed_at">
): string | null {
  if (!report.reviewed_by) return null

  const when = report.reviewed_at ? ` on ${formatDate(report.reviewed_at)}` : ""

  return `Resolved by ${report.reviewed_by.username ?? "an admin"}${when}`
}

/** The ghost thread a reported message sits in, so it can be read in context. */
export function messageThreadId(target: ReportTarget): string | null {
  return target?.type === "message" ? target.message.conversation.id : null
}

const ACT_CHOICES: Record<ReportTargetType, Option<ReportAct>[]> = {
  snacc: [
    { value: "delete_snacc", label: "Remove the snacc" },
    { value: "suspend_author", label: "Suspend the author" },
  ],
  user: [{ value: "suspend_user", label: "Suspend the user" }],
  message: [
    { value: "delete_message", label: "Remove the message" },
    { value: "suspend_sender", label: "Suspend the sender" },
  ],
  chat_message: [
    { value: "delete_chat_message", label: "Remove the message" },
    { value: "suspend_sender", label: "Suspend the sender" },
  ],
  moment: [
    { value: "delete_moment", label: "Remove the moment" },
    { value: "suspend_moment_author", label: "Suspend whoever posted it" },
  ],
}

export function actChoices(target: ReportTarget): Option<ReportAct>[] {
  return target ? ACT_CHOICES[target.type] : []
}

const SUSPEND_ACTS: ReadonlySet<ReportAct> = new Set<ReportAct>([
  "suspend_user",
  "suspend_author",
  "suspend_sender",
  "suspend_moment_author",
])

export function suspends(acts: readonly ReportAct[]): boolean {
  return acts.some((act) => SUSPEND_ACTS.has(act))
}

export function toggleAct(
  acts: readonly ReportAct[],
  act: ReportAct
): ReportAct[] {
  return acts.includes(act)
    ? acts.filter((each) => each !== act)
    : [...acts, act]
}

export const EMPTY_RESOLVE: ResolveDraft = {
  status: "actioned",
  note: "",
  acts: [],
  suspension: EMPTY_SUSPENSION,
}

function targetIds(target: ReportTarget): Partial<ResolveReportInput> {
  if (!target) return {}

  switch (target.type) {
    case "snacc":
      return { snaccId: target.snacc.id }
    case "user":
      return { reportedUserId: target.user.id }
    case "message":
      return { messageId: target.message.id }
    case "moment":
      return { momentId: target.moment.id }
    case "chat_message":
      return { chatMessageId: target.chat_message.id }
  }
}

export function toResolveInput(
  target: ReportTarget,
  draft: ResolveDraft,
  now = Date.now()
): ResolveReportInput {
  return {
    ...targetIds(target),
    status: draft.status,
    note: draft.note.trim() || undefined,
    acts: draft.acts.length > 0 ? draft.acts : undefined,
    suspension: suspends(draft.acts)
      ? toSuspendInput(draft.suspension, "", now)
      : undefined,
  }
}

/** The categories the check scored above zero, highest first. */
export function scoredCategories(
  scan: Pick<ReportScan, "scores">
): [string, number][] {
  return Object.entries(scan.scores)
    .filter(([, score]) => score > 0)
    .sort(([, a], [, b]) => b - a)
}
