import { recordSignals, type Signal } from "@/features/signals/api"
import { batchQueue } from "@/lib/batch-queue"

const queue = batchQueue(recordSignals, 50)

export function signal(kind: string, options: Omit<Signal, "kind"> = {}): void {
  const subjectId =
    options.subjectId?.length === 26 ? options.subjectId : undefined
  queue.add({ ...options, kind, subjectId })
}
