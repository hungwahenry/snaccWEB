import { uploadClip } from "@/features/clips/api"
import type { ClipDraft } from "@/features/clips/types"
import {
  clipContentType,
  progressStep,
  withLocalPoster,
} from "@/features/clips/utils/clips"
import { showError, showHeld } from "@/lib/feedback"
import { newId } from "@/lib/ids"
import { getQueryClient } from "@/lib/query/client"
import { createSnacc } from "../api"
import type { CreateSnaccInput, Snacc, SnaccAuthor, SnaccDraft } from "../types"
import { snaccKeys } from "../utils/keys"
import {
  commentsChanged,
  findSnacc,
  insertSnacc,
  patchSnacc,
  removeSnacc,
  replaceSnacc,
} from "."
import { buildOptimisticSnacc, draftToInput } from "./optimistic-snacc"

interface PendingSnacc {
  input: CreateSnaccInput
  clip: ClipDraft | null
  clipUploadId?: string
}

const pending = new Map<string, PendingSnacc>()

const shiftComments = (by: number) => (snacc: Snacc) => ({
  ...snacc,
  comments_count: snacc.comments_count + by,
})

function shiftAncestors(parentId: string, by: number): void {
  const parent = patchSnacc(parentId, shiftComments(by))
  if (parent?.parent_id) patchSnacc(parent.parent_id, shiftComments(by))
}

function showUploadProgress(id: string, fraction: number): void {
  const step = progressStep(fraction)
  if (findSnacc(id)?.upload_progress === step) return
  patchSnacc(id, (snacc) => ({ ...snacc, upload_progress: step }))
}

export function submitSnacc(draft: SnaccDraft, author: SnaccAuthor): void {
  const id = newId()

  const optimistic = buildOptimisticSnacc(id, draft, author)
  insertSnacc(optimistic)
  if (optimistic.parent_id) shiftAncestors(optimistic.parent_id, 1)

  const entry: PendingSnacc = {
    input: draftToInput(id, draft),
    clip: draft.clip,
  }
  pending.set(id, entry)
  void send(id, entry)
}

export function retrySnacc(id: string): void {
  const entry = pending.get(id)
  if (!entry) return
  patchSnacc(id, (snacc) => ({ ...snacc, status: "sending" }))
  void send(id, entry)
}

export function discardSnacc(id: string): void {
  const parentId = findSnacc(id)?.parent_id
  if (parentId) shiftAncestors(parentId, -1)
  pending.delete(id)
  removeSnacc(id)
}

export function clearPendingSnaccs(): void {
  pending.clear()
}

async function send(id: string, entry: PendingSnacc): Promise<void> {
  try {
    if (entry.clip && !entry.clipUploadId) {
      const { file } = entry.clip
      entry.clipUploadId = await uploadClip(
        file,
        clipContentType(file.type) ?? "video/mp4",
        (fraction) => showUploadProgress(id, fraction)
      )
    }

    const created = await createSnacc({
      ...entry.input,
      clipUploadId: entry.clipUploadId,
    })
    pending.delete(id)

    if (created.held) {
      discardSnacc(id)
      showHeld()
      return
    }

    const real = {
      ...created,
      clip: withLocalPoster(created.clip, entry.clip),
    }
    replaceSnacc(id, real)
    getQueryClient().setQueryData(snaccKeys.detail(real.id), real)
    if (real.parent_id) commentsChanged(real.parent_id)
  } catch (error) {
    patchSnacc(id, (snacc) => ({ ...snacc, status: "failed" }))
    showError(error)
  }
}
