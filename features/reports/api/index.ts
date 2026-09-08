import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
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

function targetField(target: ReportTarget): Record<string, string> {
  if (target.type === "snacc") return { snaccId: target.id }
  if (target.type === "moment") return { momentId: target.id }
  return { userId: target.id }
}

export async function createReport({
  target,
  reasonId,
  detail,
}: CreateReportInput): Promise<void> {
  if (target.type === "message") {
    await api.post(
      `/conversations/${target.conversationId}/messages/${target.id}/report`,
      { reasonId, detail }
    )
    return
  }
  await api.post("/reports", { reasonId, detail, ...targetField(target) })
}

export function listReportReasons(
  type: ReportableType
): Promise<ReportReason[]> {
  return api.get<ReportReason[]>("/reports/reasons", { type })
}

export function listMyReports(page: number): Promise<Paginated<MyReport>> {
  return api.get<Paginated<MyReport>>("/reports", { page })
}
