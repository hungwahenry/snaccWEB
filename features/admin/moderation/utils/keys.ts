import type { ModerationSurface, ScanQuery } from "../types"

export const adminModerationKeys = {
  all: () => ["admin", "moderation"] as const,
  surfaces: () => ["admin", "moderation", "surfaces"] as const,
  rules: () => ["admin", "moderation", "rules"] as const,
  categories: () => ["admin", "moderation", "categories"] as const,
  summary: () => ["admin", "moderation", "summary"] as const,
  scans: (query: ScanQuery) => ["admin", "moderation", "scans", query] as const,
  insight: (surface: ModerationSurface | null, category: string | null) =>
    ["admin", "moderation", "insight", surface, category] as const,
}
