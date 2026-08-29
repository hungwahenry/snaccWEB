import type { Paginated } from "@/lib/api/types"
import type { CellUser } from "@/components/admin/user-cell"

export type MomentRow = {
  id: string
  body: string | null
  background: string | null
  image_url: string | null
  author: CellUser
  views_count: number
  reports_count: number
  held_at: string | null
  deleted_at: string | null
  expires_at: string
  created_at: string
}
