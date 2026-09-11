"use client"

import { keepPreviousData, skipToken, useQuery } from "@tanstack/react-query"
import { useCallback, useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import { MINUTE_MS } from "@/lib/duration"
import {
  createRule,
  getInsight,
  getSummary,
  listCategories,
  listRules,
  listScans,
  listSurfaces,
  updateRule,
  updateSurface,
} from "../api"
import type {
  ModerationMode,
  ModerationRule,
  ModerationSurface,
  RuleDraft,
  ScanQuery,
  SurfaceChanges,
} from "../types"
import { adminModerationKeys } from "../utils/keys"
import { rulesOn, toRuleInput } from "../utils/rules"

export function useSurfaces() {
  return useQuery({
    queryKey: adminModerationKeys.surfaces(),
    queryFn: listSurfaces,
  })
}

export function useRules(surface: ModerationSurface | null) {
  const select = useCallback(
    (rules: ModerationRule[]) => rulesOn(rules, surface),
    [surface]
  )

  return useQuery({
    queryKey: adminModerationKeys.rules(),
    queryFn: listRules,
    select,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: adminModerationKeys.categories(),
    queryFn: listCategories,
    staleTime: 5 * MINUTE_MS,
  })
}

export function useSummary() {
  return useQuery({
    queryKey: adminModerationKeys.summary(),
    queryFn: getSummary,
  })
}

export function useScans(query: ScanQuery) {
  return useQuery({
    queryKey: adminModerationKeys.scans(query),
    queryFn: () => listScans(query),
    placeholderData: keepPreviousData,
  })
}

/** How one rule's category has scored on its surface, for tuning where the rule sits. */
export function useInsight(rule: ModerationRule | null) {
  return useQuery({
    queryKey: adminModerationKeys.insight(
      rule?.surface ?? null,
      rule?.category ?? null
    ),
    queryFn: rule ? () => getInsight(rule.surface, rule.category) : skipToken,
  })
}

export function useModerationActions() {
  const invalidates = [adminModerationKeys.all()]

  const { run: changeSurface } = useAdminMutation({
    mutationFn: ({
      surface,
      changes,
    }: {
      surface: ModerationSurface
      changes: SurfaceChanges
    }) => updateSurface(surface, changes),
    success: "Surface updated.",
    invalidates,
  })
  const { run: save } = useAdminMutation({
    mutationFn: ({ draft, id }: { draft: RuleDraft; id?: string }) =>
      id ? updateRule(id, toRuleInput(draft)) : createRule(toRuleInput(draft)),
    success: (_rule, { id }) => (id ? "Rule updated." : "Rule added."),
    invalidates,
  })
  const { run: setRetired } = useAdminMutation({
    mutationFn: ({ id, retired }: { id: string; retired: boolean }) =>
      updateRule(id, { retired }),
    success: "Rule updated.",
    invalidates,
  })

  return useMemo(
    () => ({
      setSurfaceEnabled: (surface: ModerationSurface, enabled: boolean) =>
        changeSurface({ surface, changes: { enabled } }),
      setSurfaceMode: (surface: ModerationSurface, mode: ModerationMode) =>
        changeSurface({ surface, changes: { mode } }),
      saveRule: (draft: RuleDraft, id?: string) => save({ draft, id }),
      setRuleRetired: (id: string, retired: boolean) =>
        setRetired({ id, retired }),
    }),
    [changeSurface, save, setRetired]
  )
}
