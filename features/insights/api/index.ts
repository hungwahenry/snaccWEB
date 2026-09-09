import { api } from "@/lib/api/client"
import type { InsightsSummary, SnaccInsight } from "../types"

export const getInsights = (days: number) =>
  api.get<InsightsSummary>("/insights", { days })

export const getSnaccInsight = (id: string) =>
  api.get<SnaccInsight>(`/insights/snaccs/${id}`)
