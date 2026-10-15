"use client"

import { useMutation } from "@tanstack/react-query"
import { patchSnacc, savedChanged } from "@/features/snaccs/cache"
import type { Snacc } from "@/features/snaccs/types"
import { showSuccess } from "@/lib/feedback"
import { saveSnacc, unsaveSnacc } from "../api"

export function useSaveToggle() {
  const save = useMutation({
    mutationFn: (input: { id: string; saved: boolean }) =>
      input.saved ? saveSnacc(input.id) : unsaveSnacc(input.id),
    onError: (_error, { id, saved }) =>
      patchSnacc(id, (snacc) => ({ ...snacc, saved: !saved })),
    onSettled: savedChanged,
  })

  return ({ id, saved }: Snacc) => {
    patchSnacc(id, (snacc) => ({ ...snacc, saved: !saved }))
    showSuccess(saved ? "Removed from saved." : "Saved.")
    save.mutate({ id, saved: !saved })
  }
}
