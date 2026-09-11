import type { UserRef } from "@/lib/api/types"
import type { AdminAccount } from "../types"

export function adminRef(admin: AdminAccount): UserRef {
  return {
    id: admin.id,
    username: admin.username,
    display_name: admin.display_name,
    avatar_url: admin.avatar_url,
  }
}

/**
 * When they first got a role. `created_at` on the account is when they joined Snacc, which says
 * nothing about when they became an admin.
 */
export function adminSince(admin: AdminAccount): string {
  const first = admin.grants
    .map((grant) => grant.created_at)
    .sort((a, b) => Date.parse(a) - Date.parse(b))[0]

  return first ?? admin.created_at
}
