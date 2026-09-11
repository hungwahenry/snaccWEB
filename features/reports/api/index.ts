import { api } from "@/lib/api/client"
import type {
  MyReport,
  ReportableType,
  ReportReason,
  ReportTarget,
} from "../types"

export interface CreateReportInput {
  target: ReportTarget
  reasonId: string
  detail?: string
}

const id = encodeURIComponent

export async function createReport({
  target,
  reasonId,
  detail,
}: CreateReportInput): Promise<void> {
  const body = { reasonId, detail }

  switch (target.type) {
    case "message":
      await api.post(
        `/conversations/${id(target.conversationId)}/messages/${id(target.id)}/report`,
        body
      )
      return
    case "chat_message":
      await api.post(`/chats/messages/${id(target.id)}/report`, body)
      return
    case "snacc":
      await api.post("/reports", { ...body, snaccId: target.id })
      return
    case "moment":
      await api.post("/reports", { ...body, momentId: target.id })
      return
    case "user":
      await api.post("/reports", { ...body, userId: target.id })
      return
  }
}

export function getReportReasons(
  type: ReportableType
): Promise<ReportReason[]> {
  return api.get<ReportReason[]>("/reports/reasons", { type })
}

export function getMyReports(): Promise<MyReport[]> {
  return api.get<MyReport[]>("/reports")
}
