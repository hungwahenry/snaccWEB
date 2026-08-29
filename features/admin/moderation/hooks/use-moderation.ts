"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import type { ModerationSurface, RuleInput, ScanQuery } from "../types"
import {
  createRule,
  getInsight,
  getSummary,
  listCategories,
  listRules,
  listScans,
  listSurfaces,
  removeRule,
  updateRule,
  updateSurface,
} from "../api"

const KEY = ["admin", "moderation"]

export function useSurfaces() {
  return useQuery({ queryKey: [...KEY, "surfaces"], queryFn: listSurfaces })
}

export function useRules() {
  return useQuery({ queryKey: [...KEY, "rules"], queryFn: listRules })
}

export function useCategories() {
  return useQuery({
    queryKey: [...KEY, "categories"],
    queryFn: listCategories,
    staleTime: 5 * 60 * 1000,
  })
}

export function useSummary() {
  return useQuery({ queryKey: [...KEY, "summary"], queryFn: getSummary })
}

export function useScans(params: ScanQuery) {
  return useQuery({
    queryKey: [...KEY, "scans", params],
    queryFn: () => listScans(params),
  })
}

export function useInsight(
  surface: ModerationSurface | null,
  category: string | null
) {
  return useQuery({
    queryKey: [...KEY, "insight", surface, category],
    queryFn: () => getInsight(surface as ModerationSurface, category as string),
    enabled: surface !== null && category !== null,
  })
}

export function useModerationMutations() {
  const qc = useQueryClient()
  const onError = (error: unknown) => toast.error(getErrorMessage(error))
  const invalidate = () => qc.invalidateQueries({ queryKey: KEY })

  return {
    surface: useMutation({
      mutationFn: ({
        surface,
        ...body
      }: { surface: ModerationSurface } & Parameters<
        typeof updateSurface
      >[1]) => updateSurface(surface, body),
      onSuccess: () => {
        invalidate()
        toast.success("Surface updated.")
      },
      onError,
    }),
    create: useMutation({
      mutationFn: createRule,
      onSuccess: () => {
        invalidate()
        toast.success("Rule added.")
      },
      onError,
    }),
    update: useMutation({
      mutationFn: ({
        id,
        input,
      }: {
        id: string
        input: Partial<RuleInput> & { retired?: boolean }
      }) => updateRule(id, input),
      onSuccess: () => {
        invalidate()
        toast.success("Rule updated.")
      },
      onError,
    }),
    remove: useMutation({
      mutationFn: removeRule,
      onSuccess: () => {
        invalidate()
        toast.success("Rule removed.")
      },
      onError,
    }),
  }
}
