"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { getErrorMessage } from "@/lib/api/errors"
import { createReport, listReportReasons } from "../api"
import type { ReportReason, ReportTarget } from "../types"

function titleFor(target: ReportTarget | null): string {
  if (!target) return "Report"
  if (target.type === "user")
    return target.username ? `Report @${target.username}` : "Report this person"
  if (target.type === "moment") return "Report this moment"
  if (target.type === "message") return "Report this message"
  return "Report this snacc"
}

export function useReportSheet() {
  const [target, setTarget] = useState<ReportTarget | null>(null)
  const [open, setOpen] = useState(false)
  const [asking, setAsking] = useState<ReportReason | null>(null)
  const [detail, setDetail] = useState("")

  const detailMaxLength = useConfigValue("content.report.detail_max_length")
  const reasons = useQuery({
    queryKey: ["reports", "reasons", target?.type ?? null],
    queryFn: () => listReportReasons(target!.type),
    enabled: target !== null,
    staleTime: Infinity,
  })
  const send = useMutation({ mutationFn: createReport })

  function file(reasonId: string, note?: string) {
    if (!target) return
    send.mutate(
      { target, reasonId, detail: note },
      {
        onSuccess: () => {
          setOpen(false)
          toast.success("Thanks. We will take a look.")
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      }
    )
  }

  function onOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setAsking(null)
      setDetail("")
    }
  }

  return {
    open(next: ReportTarget) {
      setTarget(next)
      setOpen(true)
    },
    sheet: {
      open,
      onOpenChange,
      title: titleFor(target),
      reasons: reasons.data ?? [],
      loading: reasons.isLoading,
      failed: reasons.isError,
      retry: () => void reasons.refetch(),
      sending: send.isPending,
      detailMaxLength,
      asking,
      detail,
      canSend: detail.trim().length > 0,
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
