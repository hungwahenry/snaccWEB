import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"

export type ModerationSurface =
  "snacc" | "comment" | "moment" | "message" | "anon_message" | "profile"

export type ModerationAction = "allow" | "flag" | "hold" | "block"
export type ModerationMode = "inline" | "queued"

export interface SurfaceSetting {
  surface: ModerationSurface
  enabled: boolean
  mode: ModerationMode
  timeout_ms: number
  updated_at: string
}

export interface ModerationRule {
  id: string
  surface: ModerationSurface
  category: string
  threshold: number
  action: ModerationAction
  note: string | null
  position: number
  retired: boolean
  created_at: string
  updated_at: string
}

export interface CategoryUsage {
  category: string
  label: string
  description: string
  scores_text: boolean
  scores_image: boolean
  scans: number
  ruled: ModerationSurface[]
  unknown: boolean
}

export interface CategoryInsight {
  category: string
  surface: ModerationSurface
  scans: number
  buckets: { from: number; count: number }[]
  wouldCatch: { threshold: number; count: number }[]
}

export interface ModerationSummary {
  today: number
  failures: number
  by_surface: {
    surface: ModerationSurface
    verdict: ModerationAction
    count: number
  }[]
}

export interface ModerationScan {
  id: string
  surface: ModerationSurface
  target: {
    snacc_id: string | null
    moment_id: string | null
    message_id: string | null
    user_id: string | null
  }
  model: string
  flagged: boolean
  scores: Record<string, number>
  verdict: ModerationAction
  applied: ModerationAction
  category: string | null
  score: number | null
  rule: { id: string; category: string; action: ModerationAction } | null
  report_id: string | null
  error: string | null
  latency_ms: number | null
  created_at: string
}

export interface RuleInput {
  surface: ModerationSurface
  category: string
  threshold: number
  action: ModerationAction
  note?: string
  position?: number
}

export type ScanQuery = Record<string, string | number | boolean>

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
