import { batchQueue } from "@/lib/batch-queue"
import { recordAdEvents } from "../api"
import type { AdEvent } from "../types"

const queue = batchQueue(recordAdEvents, 20)

export function adEvent(event: AdEvent): void {
  queue.add(event)
}
