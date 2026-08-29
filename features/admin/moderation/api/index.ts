import type {
  CategoryInsight,
  CategoryUsage,
  ModerationRule,
  ModerationScan,
  ModerationSummary,
  ModerationSurface,
  RuleInput,
  ScanQuery,
  SurfaceSetting,
} from "../types"
import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"

export function listSurfaces() {
  return api.get<SurfaceSetting[]>("/admin/moderation/surfaces")
}

export function updateSurface(
  surface: ModerationSurface,
  body: Partial<Pick<SurfaceSetting, "enabled" | "mode">> & {
    timeoutMs?: number
  }
) {
  return api.patch<SurfaceSetting>(
    `/admin/moderation/surfaces/${surface}`,
    body
  )
}

export function listRules() {
  return api.get<ModerationRule[]>("/admin/moderation/rules")
}

export function createRule(input: RuleInput) {
  return api.post<ModerationRule>("/admin/moderation/rules", input)
}

export function updateRule(
  id: string,
  input: Partial<RuleInput> & { retired?: boolean }
) {
  return api.patch<ModerationRule>(`/admin/moderation/rules/${id}`, input)
}

export function removeRule(id: string) {
  return api.del<{ id: string }>(`/admin/moderation/rules/${id}`)
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

export function listScans(params: ScanQuery) {
  return api.get<Paginated<ModerationScan>>("/admin/moderation/scans", params)
}
