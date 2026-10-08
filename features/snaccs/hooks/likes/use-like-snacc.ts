"use client"

import { useMutation } from "@tanstack/react-query"
import { withLike } from "@/features/likes/utils/likes"
import { showError } from "@/lib/feedback"
import { likeSnacc, unlikeSnacc } from "../../api"
import {
  cancelSnaccDetail,
  likesChanged,
  patchSnacc,
  restoreSnaccs,
  snapshotSnaccs,
} from "../../cache"
import type { Snacc } from "../../types"

interface SnaccLikeChange {
  snaccId: string
  liked: boolean
}

export function useLikeSnacc() {
  const change = useMutation({
    mutationFn: ({ snaccId, liked }: SnaccLikeChange) =>
      liked ? likeSnacc(snaccId) : unlikeSnacc(snaccId),
    onMutate: async ({ snaccId, liked }: SnaccLikeChange) => {
      await cancelSnaccDetail(snaccId)

      const snapshot = snapshotSnaccs()
      patchSnacc(snaccId, (snacc) => withLike(snacc, liked))

      return { snapshot }
    },
    onSuccess: (_data, { snaccId, liked }) =>
      patchSnacc(snaccId, (snacc) => withLike(snacc, liked)),
    onError: (error, _input, context) => {
      restoreSnaccs(context?.snapshot ?? [])
      showError(error)
    },
    onSettled: (_data, _error, { snaccId }) => likesChanged(snaccId),
  })

  return (snacc: Snacc, liked: boolean): Promise<void> =>
    change.mutateAsync({ snaccId: snacc.id, liked }).then(
      () => undefined,
      () => undefined
    )
}
