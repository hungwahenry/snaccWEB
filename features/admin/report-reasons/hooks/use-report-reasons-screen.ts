"use client"

import { useReportReasonActions, useReportReasons } from "./use-report-reasons"

export function useReportReasonsScreen() {
  return { query: useReportReasons(), actions: useReportReasonActions() }
}
