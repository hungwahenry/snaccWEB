import { api } from "@/lib/api/client"

export interface Signal {
  kind: string
  subjectId?: string
  detail?: string
  value?: number
}

export async function recordSignals(signals: Signal[]): Promise<void> {
  if (signals.length === 0) return
  await api.post("/signals", { signals })
}
