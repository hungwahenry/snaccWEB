import type { AdminPermissions } from "@/lib/permissions"

export interface AuthUser {
  id: string
  email: string
  role: string
  permissions: AdminPermissions
  profile: {
    username: string | null
    display_name: string | null
    avatar_url: string
  } | null
}
