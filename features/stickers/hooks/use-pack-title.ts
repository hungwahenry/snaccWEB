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

export interface PackTitleField {
  value: string
  placeholder: string
  action: string
  maxLength: number
  canSave: boolean
  saving: boolean
  onChange: (title: string) => void
  onSave: () => void
  onCancel?: () => void
}

export function useNewPackField(): PackTitleField {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const create = useMutation({
    mutationFn: createStickerPack,
    onSuccess: (pack) => {
      putPack(pack)
      setTitle("")
      router.push(stickerPackPath(pack.id))
    },
  })

  return {
    value: title,
    placeholder: "Name a new pack",
    action: "Create",
    maxLength: PACK_TITLE_MAX,
    canSave: packTitleReady(title) && !create.isPending,
    saving: create.isPending,
    onChange: setTitle,
    onSave: () => {
      if (packTitleReady(title)) create.mutate(title.trim())
    },
  }
}

export function useRenameField(pack: Pick<StickerPack, "id" | "title"> | null) {
  const [draft, setDraft] = useState<string | null>(null)
  const rename = useMutation({
    mutationFn: renameStickerPack,
    onSuccess: (renamed) => {
      putPack(renamed)
      setDraft(null)
      showSuccess("Pack renamed.")
    },
  })
  const trimmed = draft?.trim() ?? ""

  const field: PackTitleField | null =
    pack && draft !== null
      ? {
          value: draft,
          placeholder: "Pack name",
          action: "Save",
          maxLength: PACK_TITLE_MAX,
          canSave:
            packTitleReady(trimmed) &&
            trimmed !== pack.title &&
            !rename.isPending,
          saving: rename.isPending,
          onChange: setDraft,
          onSave: () => rename.mutate({ id: pack.id, title: trimmed }),
          onCancel: () => setDraft(null),
        }
      : null

  return {
    start: () => {
      if (pack) setDraft(pack.title)
    },
    field,
  }
}
