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
  targetType?: "snacc" | "user"
}

export interface ResolveReportInput {
  snaccId?: string
  reportedUserId?: string
  status: "actioned" | "dismissed"
  note?: string
  act?: "delete_snacc" | "suspend_user"
}
