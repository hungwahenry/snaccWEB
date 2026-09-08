import type { SnaccAuthor } from "@/features/snaccs/types"

export type ReportableType = "snacc" | "user" | "message" | "moment"

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

export interface MyReport {
  id: string
  created_at: string
  detail: string | null
  reason: string
  target:
    | {
        type: "snacc"
        snacc: { id: string; body: string | null; author: SnaccAuthor }
      }
    | { type: "user"; user: SnaccAuthor }
}
