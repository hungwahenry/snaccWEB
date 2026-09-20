import { onlineManager } from "@tanstack/react-query"
import { startClipUpload } from "@/features/clips/api"
import { progressStep, withLocalPoster } from "@/features/clips/utils/clips"
import { ApiError } from "@/lib/api/errors"
import { showError, showHeld } from "@/lib/feedback"
import { newId } from "@/lib/ids"
import { getQueryClient } from "@/lib/query/client"
import { createSnacc } from "../api"
import type { OutboxEntry, Snacc, SnaccAuthor, SnaccDraft } from "../types"
import { isSnaccList, snaccKeys } from "../utils/keys"
import {
  finishedUpload,
  fromStoredOutboxDraft,
  outboxEntry,
  ownedBy,
  retriesOnline,
} from "../utils/outbox"
import {
  commentsChanged,
  findSnacc,
  insertSnacc,
  patchSnacc,
  removeSnacc,
  replaceSnacc,
} from "."
import { buildOptimisticSnacc, draftToInput } from "./optimistic-snacc"
import {
  clearOutbox,
  completeOutboxEntry,
  noteClipUpload,
  readOutbox,
  saveToOutbox,
} from "./outbox"

interface PendingSnacc {
  entry: OutboxEntry
  draft: SnaccDraft
  sending: boolean
  failed: boolean
  cancelled: boolean
  retryWhenOnline: boolean
}

const UPLOAD_GONE = new Set(["upload_expired", "upload_not_found"])

const pending = new Map<string, PendingSnacc>()
let watching = false

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

function track(entry: OutboxEntry, draft: SnaccDraft): void {
  pending.set(entry.id, {
    entry,
    draft,
    sending: false,
    failed: false,
    cancelled: false,
    retryWhenOnline: false,
  })
  watch()
}

export function submitSnacc(draft: SnaccDraft, author: SnaccAuthor): void {
  const id = newId()

  const optimistic = buildOptimisticSnacc(id, draft, author)
  insertSnacc(optimistic)
  if (optimistic.parent_id) shiftAncestors(optimistic.parent_id, 1)

  const entry = outboxEntry(id, author, draft)
  track(entry, draft)
  void saveToOutbox(entry)
  void send(id)
}

export async function resumePendingSnaccs(author: SnaccAuthor): Promise<void> {
  for (const entry of ownedBy(await readOutbox(), author.id)) {
    if (pending.has(entry.id)) continue

    const uploadId = entry.clipUploadId
    track(
      entry,
      fromStoredOutboxDraft(entry.draft, (file) =>
        uploadId ? finishedUpload(uploadId) : startClipUpload(file)
      )
    )
    show(entry.id)
    void send(entry.id)
  }
}

export function retrySnacc(id: string): void {
  if (pending.has(id)) void send(id)
}

export function discardSnacc(id: string): void {
  const item = pending.get(id)
  if (item) {
    item.cancelled = true
    item.draft.clip?.upload.cancel()
  }

  const parentId = findSnacc(id)?.parent_id
  if (parentId) shiftAncestors(parentId, -1)

  pending.delete(id)
  removeSnacc(id)
  void completeOutboxEntry(id)
}

export function clearPendingSnaccs(): void {
  pending.forEach((item) => {
    item.cancelled = true
    item.draft.clip?.upload.cancel()
  })
  pending.clear()
  void clearOutbox()
}

function show(id: string): void {
  const item = pending.get(id)
  if (!item || findSnacc(id)) return

  insertSnacc(buildOptimisticSnacc(id, item.draft, item.entry.author), {
    counted: false,
  })
  if (item.failed) patchSnacc(id, (snacc) => ({ ...snacc, status: "failed" }))
}

function watch(): void {
  if (watching) return
  watching = true

  getQueryClient()
    .getQueryCache()
    .subscribe((event) => {
      if (
        event.type !== "updated" ||
        event.action.type !== "success" ||
        event.action.manual
      )
        return
      if (isSnaccList(event.query.queryKey))
        pending.forEach((_, id) => show(id))
    })

  onlineManager.subscribe((online) => {
    if (!online) return
    pending.forEach((item, id) => {
      if (item.failed && item.retryWhenOnline) void send(id)
    })
  })
}

async function send(id: string): Promise<void> {
  const item = pending.get(id)
  if (!item || item.sending || item.cancelled) return

  item.sending = true
  if (item.failed) {
    item.failed = false
    patchSnacc(id, (snacc) => ({ ...snacc, status: "sending" }))
  }

  try {
    const created = await deliver(id, item)
    if (!item.cancelled) settle(id, item, created)
  } catch (error) {
    if (item.cancelled) return

    item.failed = true
    item.retryWhenOnline = retriesOnline(
      error,
      error instanceof ApiError ? error.status : null
    )
    patchSnacc(id, (snacc) => ({ ...snacc, status: "failed" }))
    showError(error)
  } finally {
    item.sending = false
  }
}

async function deliver(id: string, item: PendingSnacc): Promise<Snacc> {
  const clip = item.draft.clip
  if (!clip) return createSnacc(draftToInput(id, item.draft))

  try {
    return await createWithClip(id, item)
  } catch (error) {
    if (!(error instanceof ApiError) || !UPLOAD_GONE.has(error.code ?? "")) {
      throw error
    }

    item.draft = {
      ...item.draft,
      clip: { ...clip, upload: startClipUpload(clip.file) },
    }
    item.entry = { ...item.entry, clipUploadId: undefined }
    void noteClipUpload(id, undefined)
    return createWithClip(id, item)
  }
}

async function createWithClip(id: string, item: PendingSnacc): Promise<Snacc> {
  const clip = item.draft.clip
  if (clip && !item.entry.clipUploadId) {
    const stop = clip.upload.watch((fraction) =>
      showUploadProgress(id, fraction)
    )
    try {
      const clipUploadId = await clip.upload.done()
      item.entry = { ...item.entry, clipUploadId }
      void noteClipUpload(id, clipUploadId)
    } finally {
      stop()
    }
  }

  return createSnacc({
    ...draftToInput(id, item.draft),
    clipUploadId: item.entry.clipUploadId,
    clipCoverMs: clip?.coverMs,
  })
}

function settle(id: string, item: PendingSnacc, created: Snacc): void {
  pending.delete(id)

  if (created.held) {
    discardSnacc(id)
    showHeld()
    return
  }

  void completeOutboxEntry(id)
  const real = {
    ...created,
    clip: withLocalPoster(created.clip, item.draft.clip),
  }
  if (findSnacc(id)) replaceSnacc(id, real)
  else insertSnacc(real, { counted: false })
  getQueryClient().setQueryData(snaccKeys.detail(real.id), real)
  if (real.parent_id) commentsChanged(real.parent_id)
}
