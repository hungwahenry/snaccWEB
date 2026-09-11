export const adminReservedUsernameKeys = {
  all: () => ["admin", "reserved-usernames"] as const,
  list: () => ["admin", "reserved-usernames", "list"] as const,
}
