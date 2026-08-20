import type { AdminSnacc } from "@/features/admin/snaccs/types"

export type ReportStatus = "open" | "actioned" | "dismissed"

export interface ReportAuthor {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string
  university: { id: string; name: string; acronym: string } | null
}

export type ReportTarget =
  | {
      type: "snacc"
      snacc: {
        id: string
        body: string | null
        deleted_at: string | null
        author: ReportAuthor
      }
    }
  | { type: "user"; user: ReportAuthor }
  | {
      type: "message"
      message: {
        id: string
        body: string
        deleted_at: string | null
        created_at: string
        images: { id: string; url: string; width: number; height: number }[]
        sender: ReportAuthor
        conversation: {
          id: string
          pseudonym: string
          revealed: boolean
          ghost: ReportAuthor
          target: ReportAuthor
        }
      }
    }
  | null

export interface AdminReport {
  id: string
  status: ReportStatus
  detail: string | null
  reason: { slug: string; label: string }
  reporter: ReportAuthor
  target: ReportTarget
  reviewed_by: ReportAuthor | null
  reviewed_at: string | null
  resolution_note: string | null
  created_at: string
}

export interface ListReportsParams {
  page?: number
  perPage?: number
  status?: ReportStatus
  targetType?: "snacc" | "user" | "message"
}

export interface ResolveReportInput {
  snaccId?: string
  reportedUserId?: string
  messageId?: string
  status: "actioned" | "dismissed"
  note?: string
  acts?: ("delete_snacc" | "suspend_author" | "suspend_user" | "delete_message" | "suspend_sender")[]
  suspension?: { reasonId?: string; note?: string; until?: string }
}

/** The full reported snacc, so a moderator can see media rather than a body excerpt. */
export interface AdminReportDetail extends AdminReport {
  snacc: AdminSnacc | null
  /** Other reports on the same target — resolving closes them together. */
  siblings: AdminReport[]
}
