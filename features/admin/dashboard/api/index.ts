import { api } from "@/lib/api/client"
import type {
  AudienceMetrics,
  CampusMetrics,
  ContentMetrics,
  DashboardMetrics,
  DashboardParams,
  GrowthMetrics,
  MoneyMetrics,
  NotificationMetrics,
  SafetyMetrics,
} from "../types"

export function getDashboard(params: DashboardParams) {
  return api.get<DashboardMetrics>("/admin/dashboard", params)
}

export function getAudience(params: DashboardParams) {
  return api.get<AudienceMetrics>("/admin/dashboard/audience", params)
}

export function getGrowth(params: DashboardParams) {
  return api.get<GrowthMetrics>("/admin/dashboard/growth", params)
}

export function getContent(params: DashboardParams) {
  return api.get<ContentMetrics>("/admin/dashboard/content", params)
}

export function getMoney(params: DashboardParams) {
  return api.get<MoneyMetrics>("/admin/dashboard/money", params)
}

export function getNotifications(params: DashboardParams) {
  return api.get<NotificationMetrics>("/admin/dashboard/notifications", params)
}

export function getSafety(params: DashboardParams) {
  return api.get<SafetyMetrics>("/admin/dashboard/safety", params)
}

export function getCampuses(params: DashboardParams) {
  return api.get<CampusMetrics>("/admin/dashboard/campuses", params)
}
