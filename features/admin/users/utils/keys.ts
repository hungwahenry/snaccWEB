import type { UserListQuery } from "../types"

export const adminUserKeys = {
  all: () => ["admin", "users"] as const,
  lists: () => ["admin", "users", "list"] as const,
  list: (query: UserListQuery) => ["admin", "users", "list", query] as const,
  detail: (id: string) => ["admin", "users", "detail", id] as const,
}
