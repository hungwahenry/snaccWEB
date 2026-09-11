"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback, useState } from "react"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { showSuccess } from "@/lib/feedback"
import { createReport, getReportReasons } from "../api"
import type { ReportReason, ReportTarget } from "../types"
import { reportKeys } from "../utils/keys"
import { reportTitle } from "../utils/subject"

export function useReportSheet() {
  const queryClient = useQueryClient()
  const [target, setTarget] = useState<ReportTarget | null>(null)
  const [open, setOpen] = useState(false)
  const [asking, setAsking] = useState<ReportReason | null>(null)
  const [detail, setDetail] = useState("")

  const detailMaxLength = useConfigValue("content.report.detail_max_length")
  const reasons = useQuery({
    queryKey: reportKeys.reasons(target?.type ?? "snacc"),
    queryFn: () => getReportReasons(target!.type),
    enabled: target !== null,
    staleTime: Infinity,
  })
  const send = useMutation({
    mutationFn: createReport,
    onSuccess: () => {
      setOpen(false)
      void queryClient.invalidateQueries({ queryKey: reportKeys.mine() })
      showSuccess("Thanks. We will take a look.")
    },
  })

  function file(reasonId: string, note?: string) {
    if (!target || send.isPending) return
    send.mutate({ target, reasonId, detail: note })
  }

  function onOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setAsking(null)
      setDetail("")
    }
  }

  const openFor = useCallback((next: ReportTarget) => {
    setTarget(next)
    setAsking(null)
    setDetail("")
    setOpen(true)
  }, [])

  return {
    open: openFor,
    sheet: {
      open,
      onOpenChange,
      title: reportTitle(target),
      reasons: reasons.data ?? [],
      loading: reasons.isLoading,
      failed: reasons.isError,
      retry: () => void reasons.refetch(),
      sending: send.isPending,
      detailMaxLength,
      asking,
      detail,
      canSend: detail.trim().length > 0 && !send.isPending,
      onDetailChange: setDetail,
      onPick(reason: ReportReason) {
        if (!reason.requires_detail) return file(reason.id)
        setDetail("")
        setAsking(reason)
      },
      onBack: () => setAsking(null),
      onSend: () => asking && file(asking.id, detail.trim()),
    },
  }
}
