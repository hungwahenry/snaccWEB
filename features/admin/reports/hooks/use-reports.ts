"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { adminDashboardKeys } from "@/features/admin/dashboard/utils/keys"
import { adminMessageKeys } from "@/features/admin/messages/utils/keys"
import { adminMomentKeys } from "@/features/admin/moments/utils/keys"
import { adminRoomKeys } from "@/features/admin/rooms/utils/keys"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import { adminSnaccKeys } from "@/features/admin/snaccs/utils/keys"
import { adminStickerKeys } from "@/features/admin/stickers/utils/keys"
import { adminUserKeys } from "@/features/admin/users/utils/keys"
import { getReport, listReports, resolveReport } from "../api"
import type { ReportListQuery, ReportTarget, ResolveDraft } from "../types"
import { adminReportKeys } from "../utils/keys"
import { toResolveInput } from "../utils/reports"

export function useReports(query: ReportListQuery) {
  return useQuery({
    queryKey: adminReportKeys.list(query),
    queryFn: () => listReports(query),
    placeholderData: keepPreviousData,
  })
}

export function useReport(id: string) {
  return useQuery({
    queryKey: adminReportKeys.detail(id),
    queryFn: () => getReport(id),
  })
}

export function useReportActions() {
  const { run: resolve } = useAdminMutation({
    mutationFn: ({
      target,
      draft,
    }: {
      target: ReportTarget
      draft: ResolveDraft
    }) => resolveReport(toResolveInput(target, draft)),
    success: "Reports resolved.",
    invalidates: [
      adminReportKeys.all(),
      adminSnaccKeys.all(),
      adminMomentKeys.all(),
      adminMessageKeys.all(),
      adminRoomKeys.all(),
      adminStickerKeys.all(),
      adminUserKeys.all(),
      adminDashboardKeys.all(),
    ],
  })

  return useMemo(
    () => ({
      resolve: (target: ReportTarget, draft: ResolveDraft) =>
        resolve({ target, draft }),
    }),
    [resolve]
  )
}
