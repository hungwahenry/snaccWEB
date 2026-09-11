"use client"

import { useMutation } from "@tanstack/react-query"
import { showError } from "@/lib/feedback"
import { reactToSnacc } from "../../api"
import {
  cancelSnaccQueries,
  patchSnacc,
  patchSummary,
  reactionsChanged,
  restoreSnaccs,
  snapshotSnaccs,
} from "../../cache"
import type { ReactToSnaccInput } from "../../types"
import { withReaction } from "../../utils/reactions"

export function useReactToSnacc() {
  return useMutation({
    mutationFn: reactToSnacc,
    onMutate: async ({ snaccId, emoji }: ReactToSnaccInput) => {
      await cancelSnaccQueries(snaccId)

      const snapshot = snapshotSnaccs()
      const previous = patchSnacc(snaccId, (snacc) =>
        withReaction(snacc, emoji)
      )
      if (previous) patchSummary(snaccId, previous.my_reaction, emoji)

      return { snapshot }
    },
    onError: (error, _input, context) => {
      restoreSnaccs(context?.snapshot ?? [])
      showError(error)
    },
    onSettled: (_data, _error, { snaccId }) => reactionsChanged(snaccId),
  })
}
