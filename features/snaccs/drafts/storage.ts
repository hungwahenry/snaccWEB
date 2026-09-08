import { idbGet, idbSet } from "@/lib/idb"
import { newId } from "@/lib/ids"
import type { DraftContent, StoredDraft } from "./types"

const KEY = "snacc_drafts"
export const MAX_DRAFTS = 20

/// Drafts live in IndexedDB because they carry pictures and voice notes as blobs.
export async function readDrafts(): Promise<StoredDraft[]> {
  try {
    const stored = await idbGet<StoredDraft[]>(KEY)
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

function writeDrafts(drafts: StoredDraft[]): Promise<void> {
  return idbSet(KEY, drafts)
}

export async function saveDraft(
  content: DraftContent,
  replacesId?: string
): Promise<StoredDraft> {
  const draft: StoredDraft = {
    id: newId(),
    saved_at: new Date().toISOString(),
    ...content,
  }
  const kept = (await readDrafts()).filter((entry) => entry.id !== replacesId)
  const next = [draft, ...kept].slice(0, MAX_DRAFTS)
  await writeDrafts(next)
  return draft
}

export async function removeDraft(id: string): Promise<StoredDraft[]> {
  const kept = (await readDrafts()).filter((entry) => entry.id !== id)
  await writeDrafts(kept)
  return kept
}
