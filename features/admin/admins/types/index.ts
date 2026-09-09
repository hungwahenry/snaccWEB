import type { AdminGrant } from "@/features/admin/roles/types"

export interface AdminAccount {
  id: string
  email: string
  username: string | null
  display_name: string | null
  avatar_url: string
  is_owner_account: boolean
  grants: AdminGrant[]
  created_at: string
}
