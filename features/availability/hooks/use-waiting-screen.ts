"use client"

import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { changeUniversity } from "@/features/account/api"
import { useLogout } from "@/features/auth/hooks/use-logout"
import { useCampusChoice } from "@/features/universities/hooks/use-campus-choice"
import { useAvailability } from "./use-availability"

export function useWaitingScreen() {
  const availability = useAvailability()
  const logout = useLogout()
  const choice = useCampusChoice()
  const [picking, setPicking] = useState(false)
  const current = availability.data?.campus?.id ?? null
  const canSave = choice.selected !== null && choice.selected.id !== current

  const stopPicking = () => {
    setPicking(false)
    choice.onSelect(null)
  }

  const change = useMutation({
    mutationFn: changeUniversity,
    onSuccess: () => {
      stopPicking()
      void availability.refetch()
    },
  })

  return {
    loading: availability.isPending,
    failed: availability.isError,
    availability: availability.data ?? null,
    checking: availability.isFetching,
    check: () => void availability.refetch(),
    picking,
    choice,
    startPicking: () => setPicking(true),
    stopPicking,
    canSave,
    saving: change.isPending,
    save: () => {
      if (canSave && choice.selected && !change.isPending)
        change.mutate(choice.selected.id)
    },
    signingOut: logout.isPending,
    signOut: () => logout.mutate(),
  }
}
