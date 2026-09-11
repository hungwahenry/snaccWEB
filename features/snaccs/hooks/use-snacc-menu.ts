"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { confirm } from "@/components/ui/confirm"
import { useConfirmBlock } from "@/features/blocks/hooks/use-confirm-block"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { useFlag } from "@/features/config/hooks/use-flag"
import { hideSnacc, unhideSnacc } from "@/features/hides/api"
import { useReportSheet } from "@/features/reports/hooks/use-report-sheet"
import { useShare } from "@/features/share/hooks/use-share"
import { signal } from "@/features/signals/utils/queue"
import { saveSnacc, unsaveSnacc } from "@/features/bookmarks/api"
import { showSuccess } from "@/lib/feedback"
import { copyLink, shareLink } from "@/lib/share-links"
import { commitWithUndo } from "@/lib/undoable"
import { pinSnacc, unpinSnacc } from "../api"
import {
  patchSnacc,
  removeSnacc,
  restoreSnaccs,
  setPinned,
  snapshotSnaccs,
} from "../cache"
import { editSnaccPath } from "../routes"
import type { Snacc } from "../types"
import { canEditSnacc } from "../utils/editing"
import { snaccKeys } from "../utils/keys"
import { useDeleteSnacc } from "./use-delete-snacc"

export function useSnaccMenu() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const remove = useDeleteSnacc()
  const block = useConfirmBlock()
  const save = useMutation({
    mutationFn: (input: { id: string; saved: boolean }) =>
      input.saved ? saveSnacc(input.id) : unsaveSnacc(input.id),
    onError: (_error, { id, saved }) =>
      patchSnacc(id, (snacc) => ({ ...snacc, saved: !saved })),
  })
  const pin = useMutation({
    mutationFn: (input: { id: string; pinned: boolean }) =>
      input.pinned ? pinSnacc(input.id) : unpinSnacc(input.id),
  })
  const share = useShare()
  const report = useReportSheet()

  const [acting, setActing] = useState<Snacc | null>(null)
  const [open, setOpen] = useState(false)
  const editingEnabled = useFlag("post_editing")
  const configuredWindow = useConfigValue("content.snacc.edit_window_minutes")
  const editWindowMinutes = editingEnabled ? configuredWindow : 0

  function withActing(action: (snacc: Snacc) => void) {
    return () => {
      setOpen(false)
      if (acting) action(acting)
    }
  }

  const confirmDelete = withActing((target) =>
    confirm({
      title: "Delete snacc?",
      message:
        target.comments_count > 0
          ? "Its replies go with it. This cannot be undone."
          : "This cannot be undone.",
      actions: [
        {
          label: "Delete",
          destructive: true,
          onPress: () =>
            remove.mutate(target, {
              onSuccess: () => showSuccess("Snacc deleted."),
            }),
        },
      ],
    })
  )

  const notInterested = withActing(({ id }) => {
    const snapshot = snapshotSnaccs()
    removeSnacc(id)
    commitWithUndo({
      message: "You won't see this snacc again.",
      commit: () => hideSnacc(id),
      revert: () => restoreSnaccs(snapshot),
      undo: () => unhideSnacc(id),
    })
  })

  const toggleSave = withActing(({ id, saved }) => {
    patchSnacc(id, (snacc) => ({ ...snacc, saved: !saved }))
    showSuccess(saved ? "Removed from saved." : "Saved.")
    save.mutate({ id, saved: !saved })
  })

  const togglePin = withActing(({ id, pinned, author }) => {
    const snapshot = snapshotSnaccs()
    setPinned(author.id, pinned ? null : id)
    showSuccess(pinned ? "Unpinned." : "Pinned to your profile.")
    pin.mutate(
      { id, pinned: !pinned },
      {
        onError: () => restoreSnaccs(snapshot),
        onSuccess: () => {
          if (author.username)
            void queryClient.invalidateQueries({
              queryKey: snaccKeys.userLists(author.username),
            })
        },
      }
    )
  })

  function copySnaccLink(snacc: Snacc) {
    signal("share", { subjectId: snacc.id, detail: "copy" })
    void copyLink(shareLink.snacc(snacc.id), "Snacc link")
  }

  return {
    onOpen(snacc: Snacc) {
      setActing(snacc)
      setOpen(true)
    },
    onShare: (snacc: Snacc) => share.open({ kind: "snacc", snacc }),
    report: report.sheet,
    shareCard: share.sheet,
    sheet: {
      open,
      onOpenChange: setOpen,
      mine: acting?.mine ?? false,
      editable: acting ? canEditSnacc(acting, editWindowMinutes) : false,
      onEdit: withActing((snacc) => router.push(editSnaccPath(snacc.id))),
      onShare: withActing((snacc) => share.open({ kind: "snacc", snacc })),
      onCopyLink: withActing(copySnaccLink),
      onBookmark: toggleSave,
      saved: acting?.saved ?? false,
      onPin: togglePin,
      pinned: acting?.pinned ?? false,
      anonymous: acting?.anonymous ?? false,
      onHide: notInterested,
      onDelete: confirmDelete,
      onReportSnacc: withActing((snacc) =>
        report.open({ type: "snacc", id: snacc.id })
      ),
      onReportAuthor: withActing((snacc) =>
        report.open({
          type: "user",
          id: snacc.author.id,
          username: snacc.author.username,
        })
      ),
      onBlockAuthor: withActing((snacc) => block(snacc.author)),
      authorUsername: acting?.author.username ?? null,
    },
  }
}
