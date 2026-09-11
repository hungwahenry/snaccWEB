"use client"

import { useSuspensionChoices } from "@/features/admin/suspension-reasons/hooks/use-suspension-reasons"
import { useReport, useReportActions } from "./use-reports"

export function useReportDetailScreen(id: string) {
  return {
    query: useReport(id),
    actions: useReportActions(),
    suspension: useSuspensionChoices(),
  }
}
