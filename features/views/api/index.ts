import { api } from "@/lib/api/client"

type ViewSource = "feed" | "detail"

interface RecordOptions {
  source?: ViewSource
  dwellMs?: Record<string, number>
}

export async function recordViews(
  snaccIds: string[],
  options?: RecordOptions
): Promise<void> {
  if (snaccIds.length === 0) return
  await api.post("/views", { snaccIds, ...options })
}
