import type { BadgeVariant, Option } from "@/features/admin/shell/types"
import { plural } from "@/features/admin/shell/utils/format"
import type {
  AdminGrant,
  AdminPermission,
  AdminRole,
  CreateRoleInput,
  PermissionGroup,
  RoleDraft,
  UpdateRoleInput,
} from "../types"

export const ROLE_LIMITS = { slug: 50, name: 80, description: 200 } as const

const SLUG = /^[a-z][a-z0-9_-]*$/

export function draftFrom(role?: AdminRole): RoleDraft {
  return {
    slug: role?.slug ?? "",
    name: role?.name ?? "",
    description: role?.description ?? "",
  }
}

export function isSlugValid(slug: string): boolean {
  return SLUG.test(slug.trim().toLowerCase())
}

export function isDraftReady(draft: RoleDraft, editing: boolean): boolean {
  return draft.name.trim() !== "" && (editing || isSlugValid(draft.slug))
}

export function toCreateInput(draft: RoleDraft): CreateRoleInput {
  return {
    slug: draft.slug.trim().toLowerCase(),
    name: draft.name.trim(),
    description: draft.description.trim() || undefined,
  }
}

export function toUpdateInput(draft: RoleDraft): UpdateRoleInput {
  return { name: draft.name.trim(), description: draft.description.trim() }
}

/** "Full access", or how many permissions the role carries. */
export function accessSummary(role: AdminRole): string {
  return role.allow_all
    ? "Full access"
    : plural(role.permission_keys.length, "permission")
}

/** The permission catalog by resource, in the order the API lists it. */
export function groupPermissions(
  catalog: AdminPermission[]
): PermissionGroup[] {
  const groups = new Map<string, AdminPermission[]>()
  for (const permission of catalog) {
    groups.set(permission.resource, [
      ...(groups.get(permission.resource) ?? []),
      permission,
    ])
  }

  return [...groups].map(([resource, permissions]) => ({
    resource,
    permissions,
  }))
}

/** Bare permission keys grouped by resource and sorted, e.g. for "what can I do". */
export function groupKeys(keys: string[]): [string, string[]][] {
  const groups = new Map<string, string[]>()
  for (const key of [...keys].sort()) {
    const [resource, action = ""] = key.split(".")
    groups.set(resource, [...(groups.get(resource) ?? []), action])
  }

  return [...groups]
}

export function toggleKey(keys: ReadonlySet<string>, key: string): Set<string> {
  const next = new Set(keys)
  if (next.has(key)) next.delete(key)
  else next.add(key)

  return next
}

const CAMPUS_SCOPE = "university"

/** The role's name, and the campus it is limited to when it is limited to one. */
export function grantLabel(
  grant: AdminGrant,
  acronyms: ReadonlyMap<string, string> = new Map()
): string {
  if (grant.scope_type === null && grant.scope_id === null) {
    return grant.role.name
  }
  if (grant.scope_type === CAMPUS_SCOPE && grant.scope_id !== null) {
    return `${grant.role.name} · ${acronyms.get(grant.scope_id) ?? "one campus"}`
  }

  return `${grant.role.name} · limited`
}

/** A role that can do everything stands out from one that can do a few things. */
export function grantVariant(grant: AdminGrant): BadgeVariant {
  return grant.role.allow_all ? "default" : "outline"
}

/** Roles someone does not hold yet, as choices. */
export function grantableRoles(
  roles: AdminRole[],
  grants: AdminGrant[]
): Option[] {
  const held = new Set(grants.map((grant) => grant.role.id))

  return roles
    .filter((role) => !held.has(role.id))
    .map((role) => ({ value: role.id, label: role.name }))
}
