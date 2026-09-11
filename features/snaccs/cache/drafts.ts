import { idbGet, idbSet } from "@/lib/idb"
import { newId } from "@/lib/ids"
import { getQueryClient } from "@/lib/query/client"
import type { DraftContent, StoredDraft } from "../types"
import { withoutDraft, withSavedDraft } from "../utils/drafts"
import { snaccKeys } from "../utils/keys"

const STORAGE_KEY = "snacc_drafts"

export async function readDrafts(): Promise<StoredDraft[]> {
  try {
    const stored = await idbGet<StoredDraft[]>(STORAGE_KEY)
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

// Read fresh rather than from memory: another tab may have saved since this one loaded.
async function write(change: (drafts: StoredDraft[]) => StoredDraft[]) {
  const next = change(await readDrafts())
  await idbSet(STORAGE_KEY, next)
  getQueryClient().setQueryData(snaccKeys.drafts(), next)
}

export function saveDraft(
  content: DraftContent,
  replacesId?: string
): Promise<void> {
  const draft: StoredDraft = {
    id: newId(),
    saved_at: new Date().toISOString(),
    ...content,
  }
  return write((drafts) => withSavedDraft(drafts, draft, replacesId))
}

export function removeDraft(id: string): Promise<void> {
  return write((drafts) => withoutDraft(drafts, id))
}
