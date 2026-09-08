"use client"

import { FileTextIcon, Trash2Icon } from "lucide-react"
import { useEffect, useMemo } from "react"
import { ActionSheet } from "@/components/ui/action-sheet"
import { EmptyState } from "@/components/ui/empty-state"
import { timeAgo } from "@/lib/format"
import {
  draftContextLabel,
  draftPreview,
  draftThumb,
} from "../../drafts/preview"
import type { StoredDraft } from "../../drafts/types"

export function DraftsSheet({
  open,
  onOpenChange,
  drafts,
  onPick,
  onDelete,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  drafts: StoredDraft[]
  onPick: (draft: StoredDraft) => void
  onDelete: (draft: StoredDraft) => void
}) {
  return (
    <ActionSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Drafts"
      hint="Saved in this browser"
      tall
    >
      {drafts.length === 0 ? (
        <EmptyState
          icon={FileTextIcon}
          title="No drafts yet"
          description="Snaccs you save for later land here."
          className="py-16"
        />
      ) : (
        drafts.map((draft) => (
          <DraftRow
            key={draft.id}
            draft={draft}
            onPick={onPick}
            onDelete={onDelete}
          />
        ))
      )}
    </ActionSheet>
  )
}

function useThumb(draft: StoredDraft): string | null {
  const thumb = draftThumb(draft)
  const blob = thumb && "blob" in thumb ? thumb.blob : null
  const url = useMemo(() => (blob ? URL.createObjectURL(blob) : null), [blob])

  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url)
    },
    [url]
  )

  return thumb && "url" in thumb ? thumb.url : url
}

function DraftRow({
  draft,
  onPick,
  onDelete,
}: {
  draft: StoredDraft
  onPick: (draft: StoredDraft) => void
  onDelete: (draft: StoredDraft) => void
}) {
  const thumb = useThumb(draft)
  const context = draftContextLabel(draft)

  return (
    <div className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/40">
      <button
        type="button"
        onClick={() => onPick(draft)}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        {thumb ? (
          <img
            src={thumb}
            alt=""
            className="size-12 shrink-0 rounded-lg object-cover"
          />
        ) : null}
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="line-clamp-2 font-medium text-foreground">
            {draftPreview(draft)}
          </span>
          <span className="text-sm text-muted-foreground">
            {context ? `${context} · ` : ""}
            {timeAgo(draft.saved_at)}
          </span>
        </span>
      </button>
      <button
        type="button"
        onClick={() => onDelete(draft)}
        aria-label="Delete draft"
        className="flex size-9 shrink-0 items-center justify-center rounded-full text-destructive transition-opacity active:opacity-60"
      >
        <Trash2Icon className="size-5" />
      </button>
    </div>
  )
}
