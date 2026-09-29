"use client"

import { parseAsString, parseAsStringLiteral, useQueryState } from "nuqs"
import { useCallback } from "react"
import { usePermissions } from "@/features/admin/auth/hooks/use-permissions"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import { useCampuses } from "@/features/admin/universities/hooks/use-universities"
import type { DashboardParams, DashboardTab } from "../types"
import {
  DASHBOARD_PERIODS,
  DASHBOARD_TABS,
  dashboardTabs,
  reachableCampuses,
  scopeNote,
  seesMoney,
  shownTab,
} from "../utils/dashboard"
import {
  useAudience,
  useCampusStats,
  useContent,
  useDashboard,
  useGrowth,
  useMoney,
  useNotificationStats,
  useSafety,
} from "./use-dashboard"

const TAB = parseAsStringLiteral(DASHBOARD_TABS)
  .withDefault("overview")
  .withOptions({ history: "replace" })

const FILTERS = {
  period: parseAsStringLiteral(DASHBOARD_PERIODS).withDefault("30"),
  campus: parseAsString,
}

export function useDashboardScreen() {
  const [tabParam, setTabParam] = useQueryState("tab", TAB)
  const list = useListParams(FILTERS)
  const permissions = usePermissions()
  const campuses = reachableCampuses(useCampuses().options, permissions)
  const canSeeMoney = seesMoney(permissions)
  const tab = shownTab(tabParam, canSeeMoney)

  const params: DashboardParams = {
    days: Number(list.values.period),
    campusId: list.values.campus ?? undefined,
  }
  const query = useDashboard(params)

  const campusLabel = list.values.campus
    ? (campuses.find((option) => option.value === list.values.campus)?.label ??
      "this campus")
    : undefined

  const setTab = useCallback(
    (next: DashboardTab) => void setTabParam(next),
    [setTabParam]
  )

  return {
    list,
    campuses,
    days: params.days,
    note: scopeNote(query.data?.platform ?? true, campusLabel),
    tab,
    tabs: dashboardTabs(canSeeMoney),
    setTab,
    query,
    growth: useGrowth(params, tab === "overview"),
    audience: useAudience(params, tab === "audience"),
    content: useContent(params, tab === "content"),
    money: useMoney(params, tab === "money"),
    notifications: useNotificationStats(params, tab === "notifications"),
    safety: useSafety(params, tab === "safety"),
    campusStats: useCampusStats(params, tab === "campuses"),
  }
}
