"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useCallback, useState } from "react"
import { getErrorMessage } from "@/lib/api/errors"
import { showErrorMessage, showSuccess } from "@/lib/feedback"
import { uploadPackSticker } from "../api"
import type { UploadProgress } from "../types"
import { adminStickerKeys } from "../utils/keys"
import { addedMessage, failedMessage } from "../utils/packs"

export function useStickerUploads(packId: string) {
  const queryClient = useQueryClient()
  const [progress, setProgress] = useState<UploadProgress | null>(null)

  const upload = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return

      const failures: { name: string; message: string }[] = []
      for (const [done, file] of files.entries()) {
        setProgress({ done, total: files.length })
        try {
          await uploadPackSticker(packId, file)
          void queryClient.invalidateQueries({
            queryKey: adminStickerKeys.pack(packId),
          })
        } catch (error) {
          failures.push({ name: file.name, message: getErrorMessage(error) })
        }
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminStickerKeys.pack(packId),
        }),
        queryClient.invalidateQueries({
          queryKey: adminStickerKeys.packLists(),
        }),
      ])
      setProgress(null)

      const added = files.length - failures.length
      if (added > 0) showSuccess(addedMessage(added, files.length))
      const failed = failedMessage(failures)
      if (failed) showErrorMessage(failed)
    },
    [packId, queryClient]
  )

  return { progress, upload }
}
