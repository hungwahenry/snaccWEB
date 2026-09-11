export const adminRoleKeys = {
  all: () => ["admin", "roles"] as const,
  list: () => ["admin", "roles", "list"] as const,
  catalog: () => ["admin", "roles", "catalog"] as const,
  grants: (userId: string) => ["admin", "roles", "grants", userId] as const,
}
