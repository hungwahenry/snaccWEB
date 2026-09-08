"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FEED_KEY } from "@/lib/query-keys"
import { reactToSnacc, type ReactToSnaccInput } from "../../api"
import {
  patchSnacc,
  patchSummary,
  restoreSnaccs,
  snapshotSnaccs,
} from "../../cache"
import { withReaction } from "../../utils/reactions"

export function useReactToSnacc() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reactToSnacc,
    onMutate: async ({ snaccId, emoji }: ReactToSnaccInput) => {
      await queryClient.cancelQueries({ queryKey: FEED_KEY })
      await queryClient.cancelQueries({ queryKey: ["snaccs"] })

      const snapshot = snapshotSnaccs()
      const previous = patchSnacc(snaccId, (snacc) =>
        withReaction(snacc, emoji)
      )
      if (previous) patchSummary(snaccId, previous.my_reaction, emoji)

      return { snapshot }
    },
    onError: (_error, _input, context) =>
      restoreSnaccs(context?.snapshot ?? []),
    onSettled: (_data, _error, { snaccId }) => {
      void queryClient.invalidateQueries({
        queryKey: ["snaccs", snaccId],
        exact: true,
      })
      void queryClient.invalidateQueries({
        queryKey: ["snaccs", snaccId, "reactions", "summary"],
      })
    },
  })
}
