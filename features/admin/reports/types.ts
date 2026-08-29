import type {
  MediaGif,
  MediaImage,
  MediaSticker,
} from "@/components/admin/content-media"
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
        images: MediaImage[]
        sticker: MediaSticker | null
        gif: MediaGif | null
      }
    }
  | { type: "user"; user: ReportAuthor }
  | {
      type: "moment"
      moment: {
        id: string
        body: string | null
        background: string | null
        deleted_at: string | null
        expires_at: string
        held: boolean
        author: ReportAuthor
        images: MediaImage[]
        sticker: MediaSticker | null
        gif: MediaGif | null
      }
    }
  | {
      type: "message"
      message: {
        id: string
        body: string
        deleted_at: string | null
        created_at: string
        images: MediaImage[]
        sticker: MediaSticker | null
        gif: MediaGif | null
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

export interface ReportScan {
  id: string
  model: string
  category: string | null
  score: number | null
  verdict: "allow" | "flag" | "hold" | "block"
  applied: "allow" | "flag" | "hold" | "block"
  scores: Record<string, number>
  created_at: string
}

export interface ReportFiling {
  id: string
  status: ReportStatus
  detail: string | null
  reason: { slug: string; label: string }
  source: "user" | "automation"
  reporter: ReportAuthor | null
  created_at: string
}

export interface AdminReport extends ReportFiling {
  scan: ReportScan | null
  target: ReportTarget
  reviewed_by: ReportAuthor | null
  reviewed_at: string | null
  resolution_note: string | null
}

export interface ListReportsParams {
  page?: number
  perPage?: number
  status?: ReportStatus
  targetType?: "snacc" | "user" | "message" | "moment"
}

export interface ResolveReportInput {
  snaccId?: string
  reportedUserId?: string
  messageId?: string
  momentId?: string
  status: "actioned" | "dismissed"
  note?: string
  acts?: (
    | "delete_snacc"
    | "suspend_author"
    | "suspend_user"
    | "delete_message"
    | "suspend_sender"
    | "delete_moment"
    | "suspend_moment_author"
  )[]
  suspension?: { reasonId?: string; note?: string; until?: string }
}

export interface AdminReportDetail extends AdminReport {
  snacc: AdminSnacc | null
  siblings: AdminReport[]
}
