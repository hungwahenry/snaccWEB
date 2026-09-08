"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { confirm } from "@/components/ui/confirm"
import { useConfirmBlock } from "@/features/blocks/hooks/use-confirm-block"
import {
  useBookmark,
  useUnbookmark,
} from "@/features/bookmarks/hooks/use-bookmark"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { useFlag } from "@/features/config/hooks/use-flag"
import {
  useHideSnacc,
  useUnhideSnacc,
} from "@/features/hides/hooks/use-hide-snacc"
import { useReportSheet } from "@/features/reports/hooks/use-report-sheet"
import { useShare } from "@/features/share/hooks/use-share"
import { getErrorMessage } from "@/lib/api/errors"
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
import { copySnaccLink } from "../utils/share"
import { useDeleteSnacc } from "./use-delete-snacc"

export function useSnaccMenu() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const remove = useDeleteSnacc()
  const block = useConfirmBlock()
  const bookmark = useBookmark()
  const unbookmark = useUnbookmark()
  const hide = useHideSnacc()
  const unhide = useUnhideSnacc()
  const pin = useMutation({ mutationFn: pinSnacc })
  const unpin = useMutation({ mutationFn: unpinSnacc })
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
              onSuccess: () => toast.success("Snacc deleted."),
              onError: (error) => toast.error(getErrorMessage(error)),
            }),
        },
      ],
    })
  )

  const notInterested = withActing((target) => {
    const { id } = target
    const snapshot = snapshotSnaccs()
    removeSnacc(id)

    const hiding = hide.mutateAsync(id)
    const toastId = toast("You won't see this snacc again.", {
      action: {
        label: "Undo",
        onClick: () => {
          toast.dismiss(toastId)
          restoreSnaccs(snapshot)
          void hiding.then(() => unhide.mutate(id)).catch(() => undefined)
        },
      },
    })

    hiding.catch((error) => {
      toast.dismiss(toastId)
      restoreSnaccs(snapshot)
      toast.error(getErrorMessage(error))
    })
  })

  const toggleSave = withActing((target) => {
    const { id, saved } = target
    patchSnacc(id, (snacc) => ({ ...snacc, saved: !saved }))
    toast.success(saved ? "Removed from saved." : "Saved.")

    ;(saved ? unbookmark : bookmark).mutate(id, {
      onError: (error) => {
        patchSnacc(id, (snacc) => ({ ...snacc, saved }))
        toast.error(getErrorMessage(error))
      },
    })
  })

  const togglePin = withActing((target) => {
    const { id, pinned, author } = target
    const snapshot = snapshotSnaccs()
    setPinned(author.id, pinned ? null : id)
    toast.success(pinned ? "Unpinned." : "Pinned to your profile.")

    ;(pinned ? unpin : pin).mutate(id, {
      onError: (error) => {
        restoreSnaccs(snapshot)
        toast.error(getErrorMessage(error))
      },
      onSuccess: () => {
        if (author.username) {
          void queryClient.invalidateQueries({
            queryKey: ["users", "snaccs", author.username.toLowerCase()],
          })
        }
      },
    })
  })

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
      onCopyLink: withActing((snacc) => void copySnaccLink(snacc)),
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
