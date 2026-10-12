"use client"

import { useMutation } from "@tanstack/react-query"
import { changeUniversity } from "@/features/account/api"
import { useLogout } from "@/features/auth/hooks/use-logout"
import { useCampusSheet } from "@/features/universities/hooks/use-campus-sheet"
import { useAvailability } from "./use-availability"

export function useWaitingScreen() {
  const availability = useAvailability()
  const logout = useLogout()
  const current = availability.data?.campus?.id ?? null

  const change = useMutation({
    mutationFn: changeUniversity,
    onSuccess: () => void availability.refetch(),
  })
  const campus = useCampusSheet((university) => {
    if (university.id !== current) change.mutate(university.id)
  })

  return {
    loading: availability.isPending,
    failed: availability.isError,
    availability: availability.data ?? null,
    checking: availability.isFetching,
    check: () => void availability.refetch(),
    changeCampus: campus.show,
    changing: change.isPending,
    campusSheet: campus.sheet,
    signingOut: logout.isPending,
    signOut: () => logout.mutate(),
  }
}
