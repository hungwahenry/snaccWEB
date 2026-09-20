import type { ClipUpload } from "@/features/clips/types"
import type {
  OutboxEntry,
  SnaccAuthor,
  SnaccDraft,
  StoredOutboxDraft,
} from "../types"
import { toPicked, toStoredImage, toStoredVoice, toVoiceDraft } from "./drafts"

export function toStoredOutboxDraft(draft: SnaccDraft): StoredOutboxDraft {
  return {
    ...draft,
    images: draft.images.map(toStoredImage),
    voice: draft.voice ? toStoredVoice(draft.voice) : null,
    clip: draft.clip
      ? {
          file: draft.clip.file,
          durationMs: draft.clip.durationMs,
          width: draft.clip.width,
          height: draft.clip.height,
          coverMs: draft.clip.coverMs,
        }
      : null,
    poll: draft.poll && {
      ...draft.poll,
      images: draft.poll.images?.map(toStoredImage),
    },
  }
}

export function fromStoredOutboxDraft(
  stored: StoredOutboxDraft,
  uploadOf: (file: File) => ClipUpload
): SnaccDraft {
  return {
    ...stored,
    images: stored.images.map(toPicked),
    voice: stored.voice ? toVoiceDraft(stored.voice) : null,
    clip: stored.clip
      ? {
          ...stored.clip,
          posterUrl: null,
          upload: uploadOf(stored.clip.file),
        }
      : null,
    poll: stored.poll && {
      ...stored.poll,
      images: stored.poll.images?.map(toPicked),
    },
  }
}

export function finishedUpload(clipUploadId: string): ClipUpload {
  return {
    done: () => Promise.resolve(clipUploadId),
    watch: (listener) => {
      listener(1)
      return () => undefined
    },
    cancel: () => undefined,
  }
}

export function outboxEntry(
  id: string,
  author: SnaccAuthor,
  draft: SnaccDraft
): OutboxEntry {
  return { id, author, draft: toStoredOutboxDraft(draft) }
}

export function withEntry(
  entries: OutboxEntry[],
  entry: OutboxEntry
): OutboxEntry[] {
  return [...entries.filter((queued) => queued.id !== entry.id), entry]
}

export function withoutEntry(
  entries: OutboxEntry[],
  id: string
): OutboxEntry[] {
  return entries.filter((queued) => queued.id !== id)
}

export function withClipUpload(
  entries: OutboxEntry[],
  id: string,
  clipUploadId: string | undefined
): OutboxEntry[] {
  return entries.map((queued) =>
    queued.id === id ? { ...queued, clipUploadId } : queued
  )
}

export function ownedBy(
  entries: OutboxEntry[],
  authorId: string
): OutboxEntry[] {
  return entries.filter((queued) => queued.author.id === authorId)
}

export function retriesOnline(error: unknown, status: number | null): boolean {
  return status === null || status >= 500 || error instanceof TypeError
}
