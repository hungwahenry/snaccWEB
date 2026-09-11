import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type {
  CategoryInsight,
  CategoryUsage,
  ModerationRule,
  ModerationScan,
  ModerationSummary,
  ModerationSurface,
  RuleChanges,
  RuleInput,
  ScanQuery,
  SurfaceChanges,
  SurfaceSetting,
} from "../types"

export function listSurfaces() {
  return api.get<SurfaceSetting[]>("/admin/moderation/surfaces")
}

export function updateSurface(
  surface: ModerationSurface,
  changes: SurfaceChanges
) {
  return api.patch<SurfaceSetting>(
    `/admin/moderation/surfaces/${surface}`,
    changes
  )
}

export function listRules() {
  return api.get<ModerationRule[]>("/admin/moderation/rules")
}

export function createRule(input: RuleInput) {
  return api.post<ModerationRule>("/admin/moderation/rules", input)
}

export function updateRule(id: string, changes: RuleChanges) {
  return api.patch<ModerationRule>(`/admin/moderation/rules/${id}`, changes)
}

export function listCategories() {
  return api.get<CategoryUsage[]>("/admin/moderation/categories")
}

export function getInsight(surface: ModerationSurface, category: string) {
  return api.get<CategoryInsight>("/admin/moderation/insights", {
    surface,
    category,
  })
}

export function getSummary() {
  return api.get<ModerationSummary>("/admin/moderation/summary")
}

export function listScans(query: ScanQuery) {
  return api.get<Paginated<ModerationScan>>("/admin/moderation/scans", query)
}
