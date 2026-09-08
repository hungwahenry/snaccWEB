"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteSnacc } from "../api"
import { removeSnacc } from "../cache"
import type { Snacc } from "../types"

export function useDeleteSnacc() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (snacc: Snacc) => deleteSnacc(snacc.id),
    onSuccess: (_data, snacc) => {
      removeSnacc(snacc.id)
      if (snacc.parent_id) {
        void queryClient.invalidateQueries({
          queryKey: ["snaccs", snacc.parent_id],
        })
      }
    },
  })
}
