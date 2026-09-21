export const adminFlagKeys = {
  all: () => ["admin", "flags"] as const,
  list: () => ["admin", "flags", "list"] as const,
  members: (key: string) => ["admin", "flags", "members", key] as const,
}
