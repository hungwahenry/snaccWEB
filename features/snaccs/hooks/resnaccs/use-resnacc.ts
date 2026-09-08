"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { newId } from "@/lib/ids"
import { FEED_KEY } from "@/lib/query-keys"
import { createSnacc, undoResnacc } from "../../api"
import { patchSnacc, restoreSnaccs, snapshotSnaccs } from "../../cache"
import type { Snacc } from "../../types"

export function useResnacc() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (snacc: Snacc) => {
      if (snacc.my_resnacc) return undoResnacc(snacc.id)
      await createSnacc({ id: newId(), resnaccOfId: snacc.id })
    },
    onMutate: async (snacc: Snacc) => {
      await queryClient.cancelQueries({ queryKey: FEED_KEY })
      await queryClient.cancelQueries({ queryKey: ["snaccs"] })

      const snapshot = snapshotSnaccs()
      const undoing = snacc.my_resnacc

      patchSnacc(snacc.id, (current) => ({
        ...current,
        my_resnacc: !undoing,
        resnaccs_count: Math.max(
          0,
          current.resnaccs_count + (undoing ? -1 : 1)
        ),
      }))

      return { snapshot }
    },
    onError: (_error, _snacc, context) =>
      restoreSnaccs(context?.snapshot ?? []),
    onSettled: (_data, _error, snacc) => {
      void queryClient.invalidateQueries({
        queryKey: ["snaccs", snacc.id],
        exact: true,
      })
      void queryClient.invalidateQueries({ queryKey: FEED_KEY })
    },
  })
}
