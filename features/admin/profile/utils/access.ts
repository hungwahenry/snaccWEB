import type { AdminGrant } from "@/features/admin/roles/types"
import { plural } from "@/features/admin/shell/utils/format"
import type { OwnAccess } from "../types"

export function permissionsSummary(access: OwnAccess): string {
  if (access.all) {
    return "Full access. Every permission below, including any added later."
  }

  return `${plural(access.permissions.length, "permission")}, and only these.`
}

export function campusNote(grants: AdminGrant[]): string | null {
  const campuses = grants.flatMap((grant) =>
    grant.campus ? [grant.campus.acronym] : []
  )
  if (campuses.length === 0 || grants.some((grant) => !grant.campus)) {
    return null
  }

  return `Your roles cover ${[...new Set(campuses)].join(", ")} only, so you see and act on their people and posts.`
}
