"use client"

import { useMutation } from "@tanstack/react-query"
import { dropHangouts, hangoutListsChanged } from "@/features/hangouts/cache"
import { showError } from "@/lib/feedback"
import { deleteSnacc } from "../api"
import {
  commentsChanged,
  dropDeletedFromLists,
  removeSnacc,
  restoreSnaccs,
  snapshotSnaccs,
} from "../cache"
import type { Snacc } from "../types"

export function useDeleteSnacc() {
  return useMutation({
    mutationFn: (snacc: Snacc) => deleteSnacc(snacc.id),
    onMutate: (snacc) => {
      const snapshot = snapshotSnaccs()
      dropDeletedFromLists(snacc.id)
      if (snacc.hangout) dropHangouts([snacc.id])
      return { snapshot }
    },
    onError: (error, snacc, context) => {
      restoreSnaccs(context?.snapshot ?? [])
      if (snacc.hangout) hangoutListsChanged()
      showError(error)
    },
    onSuccess: (_data, snacc) => {
      removeSnacc(snacc.id)
      if (snacc.parent_id) commentsChanged(snacc.parent_id)
    },
  })
}
