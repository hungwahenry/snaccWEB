"use client"

import { useState } from "react"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import type { PickedImage } from "@/lib/media"

type Pending = {
  image: PickedImage
  resolve: (result: PickedImage | null) => void
}

export function useImageEditor() {
  const [pending, setPending] = useState<Pending | null>(null)

  function edit(image: PickedImage): Promise<PickedImage | null> {
    return new Promise((resolve) => setPending({ image, resolve }))
  }

  function cancel() {
    pending?.resolve(null)
    setPending(null)
  }

  function finish(edited: PickedImage | null) {
    if (!edited) {
      toast.error("Could not save the edit.")
      pending?.resolve(null)
    } else {
      pending?.resolve(edited)
    }
    setPending(null)
  }

  function fail(error: unknown) {
    toast.error(getErrorMessage(error))
    pending?.resolve(null)
    setPending(null)
  }

  async function editInto<T>(
    items: T[],
    target: T,
    assetOf: (item: T) => PickedImage,
    replace: (item: T, edited: PickedImage) => T
  ): Promise<T[] | null> {
    const edited = await edit(assetOf(target))
    if (!edited) return null
    return items.map((item) => (item === target ? replace(item, edited) : item))
  }

  return {
    edit,
    editInto,
    sheet: {
      image: pending?.image ?? null,
      onCancel: cancel,
      onFinish: finish,
      onFail: fail,
    },
  }
}

export type ImageEditorSheetState = ReturnType<typeof useImageEditor>["sheet"]
