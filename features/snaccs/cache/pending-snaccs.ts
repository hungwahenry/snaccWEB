import { startClipUpload } from "@/features/clips/api"
import type { ClipDraft } from "@/features/clips/types"
import { progressStep, withLocalPoster } from "@/features/clips/utils/clips"
import { ApiError } from "@/lib/api/errors"
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

const UPLOAD_GONE = new Set(["upload_expired", "upload_not_found"])

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
  pending.get(id)?.clip?.upload.cancel()
  pending.delete(id)
  removeSnacc(id)
}

export function clearPendingSnaccs(): void {
  pending.forEach((entry) => entry.clip?.upload.cancel())
  pending.clear()
}

async function deliver(id: string, entry: PendingSnacc): Promise<Snacc> {
  const clip = entry.clip
  if (!clip) return createSnacc(entry.input)

  try {
    return await createWithClip(id, entry, clip)
  } catch (error) {
    if (!(error instanceof ApiError) || !UPLOAD_GONE.has(error.code ?? "")) {
      throw error
    }

    const fresh = { ...clip, upload: startClipUpload(clip.file) }
    entry.clip = fresh
    entry.clipUploadId = undefined
    return createWithClip(id, entry, fresh)
  }
}

async function createWithClip(
  id: string,
  entry: PendingSnacc,
  clip: ClipDraft
): Promise<Snacc> {
  if (!entry.clipUploadId) {
    const stop = clip.upload.watch((fraction) =>
      showUploadProgress(id, fraction)
    )
    try {
      entry.clipUploadId = await clip.upload.done()
    } finally {
      stop()
    }
  }

  return createSnacc({ ...entry.input, clipUploadId: entry.clipUploadId })
}

async function send(id: string, entry: PendingSnacc): Promise<void> {
  try {
    const created = await deliver(id, entry)
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
