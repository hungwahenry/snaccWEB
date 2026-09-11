"use client"

import { useMutation } from "@tanstack/react-query"
import { newId } from "@/lib/ids"
import { showError } from "@/lib/feedback"
import { createSnacc, undoResnacc } from "../../api"
import {
  cancelSnaccQueries,
  patchSnacc,
  resnaccsChanged,
  restoreSnaccs,
  snapshotSnaccs,
} from "../../cache"
import type { Snacc } from "../../types"

export function useResnacc() {
  return useMutation({
    mutationFn: async (snacc: Snacc) => {
      if (snacc.my_resnacc) return undoResnacc(snacc.id)
      await createSnacc({ id: newId(), resnaccOfId: snacc.id })
    },
    onMutate: async (snacc: Snacc) => {
      await cancelSnaccQueries(snacc.id)

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
    onError: (error, _snacc, context) => {
      restoreSnaccs(context?.snapshot ?? [])
      showError(error)
    },
    onSettled: (_data, _error, snacc) => resnaccsChanged(snacc.id),
  })
}
