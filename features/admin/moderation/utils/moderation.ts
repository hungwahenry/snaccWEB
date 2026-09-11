import type { StatusMeta } from "@/features/admin/shell/types"
import type {
  CategoryUsage,
  ModerationSummary,
  ModerationTab,
  ModerationTotals,
  SurfaceSetting,
} from "../types"

export const MODERATION_TABS: readonly ModerationTab[] = [
  "rules",
  "surfaces",
  "categories",
  "reviews",
]

/** The numbers across the top. Anything still loading counts as nothing yet. */
export function moderationTotals(
  summary: ModerationSummary | undefined,
  surfaces: SurfaceSetting[] = [],
  categories: CategoryUsage[] = []
): ModerationTotals {
  const rows = summary?.by_surface ?? []

  return {
    reviewed: rows.reduce((total, row) => total + row.count, 0),
    today: summary?.today ?? 0,
    acted: rows
      .filter((row) => row.verdict !== "allow")
      .reduce((total, row) => total + row.count, 0),
    live: surfaces.filter((surface) => surface.enabled).length,
    surfaces: surfaces.length,
    failures: summary?.failures ?? 0,
    unruled: categories.filter((entry) => entry.ruled.length === 0).length,
  }
}

/** What a category can be scored from, and whether the classifier only just started sending it. */
export function scoreSources(category: CategoryUsage): StatusMeta[] {
  return [
    ...(category.scores_text
      ? [{ label: "text", variant: "outline" } as const]
      : []),
    category.scores_image
      ? ({ label: "images", variant: "outline" } as const)
      : ({ label: "text only", variant: "secondary" } as const),
    ...(category.unknown
      ? [{ label: "new", variant: "default" } as const]
      : []),
  ]
}
