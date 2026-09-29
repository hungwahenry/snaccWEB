"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import {
  getAudience,
  getCampuses,
  getContent,
  getDashboard,
  getGrowth,
  getMoney,
  getNotifications,
  getSafety,
} from "../api"
import type { DashboardParams } from "../types"
import { adminDashboardKeys } from "../utils/keys"

function useSection<T>(
  section: string,
  load: (params: DashboardParams) => Promise<T>,
  params: DashboardParams,
  enabled: boolean
) {
  return useQuery({
    queryKey: adminDashboardKeys.section(section, params),
    queryFn: () => load(params),
    placeholderData: keepPreviousData,
    enabled,
  })
}

export function useDashboard(params: DashboardParams) {
  return useSection("overview", getDashboard, params, true)
}

export function useGrowth(params: DashboardParams, enabled: boolean) {
  return useSection("growth", getGrowth, params, enabled)
}

export function useAudience(params: DashboardParams, enabled: boolean) {
  return useSection("audience", getAudience, params, enabled)
}

export function useContent(params: DashboardParams, enabled: boolean) {
  return useSection("content", getContent, params, enabled)
}

export function useMoney(params: DashboardParams, enabled: boolean) {
  return useSection("money", getMoney, params, enabled)
}

export function useNotificationStats(
  params: DashboardParams,
  enabled: boolean
) {
  return useSection("notifications", getNotifications, params, enabled)
}

export function useSafety(params: DashboardParams, enabled: boolean) {
  return useSection("safety", getSafety, params, enabled)
}

export function useCampusStats(params: DashboardParams, enabled: boolean) {
  return useSection("campuses", getCampuses, params, enabled)
}
