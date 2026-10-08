"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { showSuccess } from "@/lib/feedback"
import { createStickerPack, renameStickerPack } from "../api"
import { putPack } from "../cache"
import { stickerPackPath } from "../routes"
import type { StickerPack } from "../types"
import { PACK_TITLE_MAX, packTitleReady } from "../utils/packs"

function usePackTitleSheet(
  copy: { heading: string; action: string },
  busy: boolean,
  save: (title: string, done: () => void) => void
) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const ready = packTitleReady(title) && !busy

  return {
    begin: (current: string) => {
      setTitle(current)
      setOpen(true)
    },
    sheet: {
      ...copy,
      open,
      onOpenChange: setOpen,
      title,
      maxLength: PACK_TITLE_MAX,
      onTitleChange: setTitle,
      canSave: ready,
      saving: busy,
      onSave: () => {
        if (ready) save(title.trim(), () => setOpen(false))
      },
    },
  }
}

export function useNewStickerPack() {
  const router = useRouter()
  const create = useMutation({
    mutationFn: createStickerPack,
    onSuccess: (pack) => {
      putPack(pack)
      router.push(stickerPackPath(pack.id))
    },
  })
  const { begin, sheet } = usePackTitleSheet(
    { heading: "New pack", action: "Make pack" },
    create.isPending,
    (title, done) => create.mutate(title, { onSuccess: done })
  )

  return { start: () => begin(""), sheet }
}

export function useRenameStickerPack(pack: StickerPack | undefined) {
  const rename = useMutation({
    mutationFn: renameStickerPack,
    onSuccess: (renamed) => {
      putPack(renamed)
      showSuccess("Pack renamed.")
    },
  })
  const { begin, sheet } = usePackTitleSheet(
    { heading: "Rename pack", action: "Save" },
    rename.isPending,
    (title, done) => {
      if (pack) rename.mutate({ id: pack.id, title }, { onSuccess: done })
    }
  )

  return { start: () => begin(pack?.title ?? ""), sheet }
}
