"use client"

import { useMutation } from "@tanstack/react-query"
import { useBack } from "@/hooks/use-back"
import { editSnacc } from "../../api"
import { patchSnacc } from "../../cache"
import type { Snacc } from "../../types"
import {
  keptImageIds,
  pickedAssets,
  toDraftImages,
} from "../../utils/draft-images"
import { useSnaccDraft } from "./use-snacc-draft"
import { showError, showSuccess } from "@/lib/feedback"

export function useSnaccEditor(snacc: Snacc) {
  const back = useBack()
  const draft = useSnaccDraft({
    body: snacc.body ?? "",
    images: toDraftImages(snacc.images),
    // Keeps its giphy id: sending it back is how the GIF survives, sending nothing removes it.
    gif: snacc.gif
      ? {
          id: snacc.gif.giphy_id,
          url: snacc.gif.url,
          preview_url: snacc.gif.preview_url,
          width: snacc.gif.width,
          height: snacc.gif.height,
          title: null,
        }
      : null,
    spoiler: snacc.spoiler,
    storedVoice: snacc.voice,
  })

  const save = useMutation({
    mutationFn: editSnacc,
    onSuccess: (updated) => patchSnacc(updated.id, () => updated),
  })

  const changed =
    draft.trimmed !== (snacc.body ?? "") ||
    draft.spoiler !== snacc.spoiler ||
    (draft.gif?.id ?? null) !== (snacc.gif?.giphy_id ?? null) ||
    keptImageIds(draft.images).join() !==
      snacc.images.map((image) => image.id).join() ||
    pickedAssets(draft.images).length > 0

  function submit() {
    if (!draft.withinLimits || save.isPending) return

    save.mutate(
      {
        id: snacc.id,
        body: draft.trimmed || undefined,
        keepImageIds: keptImageIds(draft.images),
        images: pickedAssets(draft.images),
        giphyId: draft.gif?.id,
        stickerId: snacc.sticker?.sticker_id ?? undefined,
        spoiler: draft.hasMedia && draft.spoiler,
      },
      {
        onSuccess: () => {
          showSuccess("Snacc updated.")
          back()
        },
        onError: (error) => showError(error),
      }
    )
  }

  return {
    ...draft,
    canSave: draft.withinLimits && changed && !save.isPending,
    saving: save.isPending,
    submit,
    close: back,
  }
}
