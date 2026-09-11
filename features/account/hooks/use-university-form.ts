"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useUniversities } from "@/features/universities/hooks/use-universities"
import type { University } from "@/features/universities/types"
import type { Profile } from "@/features/users/types"
import { useBack } from "@/hooks/use-back"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { authKeys } from "@/features/auth/utils/keys"
import { changeUniversity } from "../api"
import { showSuccess } from "@/lib/feedback"

export function useUniversityForm(profile: Profile) {
  const back = useBack("/edit-profile")
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<University | null>(null)

  const debounced = useDebouncedValue(search, 300)
  const universities = useUniversities(debounced)

  const change = useMutation({
    mutationFn: changeUniversity,
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me(), user)
      void queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "users" && query.queryKey[1] === "profile",
      })
      showSuccess("Campus updated.")
      back()
    },
  })

  const valid = selected !== null && selected.id !== profile.university?.id

  return {
    locked: profile.university_locked,
    currentName: profile.university?.name ?? null,
    search,
    setSearch,
    searching: universities.isFetching,
    results: search.trim() ? (universities.data?.items ?? []) : [],
    selected,
    select: (university: University | null) => {
      setSelected(university)
      setSearch("")
    },
    valid,
    submitting: change.isPending,
    onSubmit: () => {
      if (valid && selected && !change.isPending) change.mutate(selected.id)
    },
  }
}
