import { idbDelete, idbGet, idbSet } from "@/lib/idb"
import type { OutboxEntry } from "../types"
import { withClipUpload, withEntry, withoutEntry } from "../utils/outbox"

const STORAGE_KEY = "snacc_outbox"

let queue: Promise<void> = Promise.resolve()

export async function readOutbox(): Promise<OutboxEntry[]> {
  try {
    const stored = await idbGet<OutboxEntry[]>(STORAGE_KEY)
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

function write(change: (entries: OutboxEntry[]) => OutboxEntry[]): Promise<void> {
  queue = queue
    .then(async () => idbSet(STORAGE_KEY, change(await readOutbox())))
    .catch(() => undefined)
  return queue
}

export function saveToOutbox(entry: OutboxEntry): Promise<void> {
  return write((entries) => withEntry(entries, entry))
}

export function noteClipUpload(
  id: string,
  clipUploadId: string | undefined
): Promise<void> {
  return write((entries) => withClipUpload(entries, id, clipUploadId))
}

export function completeOutboxEntry(id: string): Promise<void> {
  return write((entries) => withoutEntry(entries, id))
}

export function clearOutbox(): Promise<void> {
  queue = queue.then(() => idbDelete(STORAGE_KEY)).catch(() => undefined)
  return queue
}
