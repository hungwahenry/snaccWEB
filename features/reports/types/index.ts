import type { SnaccAuthor } from "@/features/snaccs/types"

export type ReportableType =
  "snacc" | "user" | "message" | "moment" | "chat_message"

export interface ReportReason {
  id: string
  slug: string
  label: string
  hint: string | null
  requires_detail: boolean
}

export type ReportTarget =
  | { type: "snacc"; id: string }
  | { type: "moment"; id: string }
  | { type: "user"; id: string; username: string | null }
  | { type: "message"; id: string; conversationId: string }
  | { type: "chat_message"; id: string }

export type MyReportTarget =
  | {
      type: "snacc"
      snacc: { id: string; body: string | null; author: SnaccAuthor }
    }
  | { type: "user"; user: SnaccAuthor }
  | { type: "moment"; moment: { id: string }; user: SnaccAuthor }
  | {
      type: "message"
      message: { id: string; conversation_id: string }
      user: SnaccAuthor
    }
  | {
      type: "chat_message"
      chat_message: { id: string; room_id: string }
      user: SnaccAuthor
    }

export interface MyReport {
  id: string
  created_at: string
  detail: string | null
  reason: string
  target: MyReportTarget
}

/** A filed report in one line: who it was about, what, and where to go to see it. */
export interface ReportSubject {
  person: SnaccAuthor
  what: string
  href: string
}
