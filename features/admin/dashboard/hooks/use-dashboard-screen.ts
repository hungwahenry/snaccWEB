"use client"

import { parseAsString, parseAsStringLiteral, useQueryState } from "nuqs"
import { useCallback, useMemo } from "react"
import { usePermissions } from "@/features/admin/auth/hooks/use-permissions"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import { useCampusName } from "@/features/admin/universities/hooks/use-campus-search"
import { useCountries } from "@/features/places/hooks/use-places"
import { campusesFor } from "@/lib/permissions"
import type { DashboardParams, DashboardTab } from "../types"
import {
  DASHBOARD_PERIODS,
  DASHBOARD_TABS,
  dashboardCountries,
  dashboardTabs,
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
  country: parseAsString,
}

export function useDashboardScreen() {
  const [tabParam, setTabParam] = useQueryState("tab", TAB)
  const list = useListParams(FILTERS)
  const permissions = usePermissions()
  const campuses = campusesFor(permissions, "dashboard.read")
  const canSeeMoney = seesMoney(permissions)
  const tab = shownTab(tabParam, canSeeMoney)

  const params: DashboardParams = {
    days: Number(list.values.period),
    campusId: list.values.campus ?? undefined,
    country: list.values.country ?? undefined,
  }
  const query = useDashboard(params)
  const countries = useCountries()
  const countryOptions = useMemo(
    () => dashboardCountries(countries.data ?? []),
    [countries.data]
  )
  const countryLabel = countryOptions.find(
    (option) => option.value === list.values.country
  )?.label

  const pickedName = useCampusName(list.values.campus)
  const campusLabel = list.values.campus
    ? (pickedName ?? "this campus")
    : undefined

  const setTab = useCallback(
    (next: DashboardTab) => void setTabParam(next),
    [setTabParam]
  )

  return {
    list,
    campuses,
    days: params.days,
    countryOptions,
    note: scopeNote(query.data?.platform ?? true, campusLabel, countryLabel),
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
