import type { AnnouncementListQuery } from "../types"

export const adminAnnouncementKeys = {
  all: () => ["admin", "announcements"] as const,
  list: (query: AnnouncementListQuery) =>
    ["admin", "announcements", "list", query] as const,
}
