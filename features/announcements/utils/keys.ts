export const announcementKeys = {
  all: () => ["announcements"] as const,
  banner: () => ["announcements", "banner"] as const,
  detail: (id: string) => ["announcements", "detail", id] as const,
}
