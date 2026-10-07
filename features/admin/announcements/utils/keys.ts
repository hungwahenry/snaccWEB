import type { AnnouncementListQuery, AudienceInput } from "../types"

export const adminAnnouncementKeys = {
  all: () => ["admin", "announcements"] as const,
  lists: () => ["admin", "announcements", "list"] as const,
  list: (query: AnnouncementListQuery) =>
    ["admin", "announcements", "list", query] as const,
  detail: (id: string) => ["admin", "announcements", "detail", id] as const,
  reach: (audience: AudienceInput | null) =>
    ["admin", "announcements", "reach", audience] as const,
}
