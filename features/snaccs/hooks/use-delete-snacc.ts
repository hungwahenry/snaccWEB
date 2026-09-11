"use client"

import { useMutation } from "@tanstack/react-query"
import { deleteSnacc } from "../api"
import { commentsChanged, removeSnacc } from "../cache"
import type { Snacc } from "../types"

export function useDeleteSnacc() {
  return useMutation({
    mutationFn: (snacc: Snacc) => deleteSnacc(snacc.id),
    onSuccess: (_data, snacc) => {
      removeSnacc(snacc.id)
      if (snacc.parent_id) commentsChanged(snacc.parent_id)
    },
  })
}
