"use client"

import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useFlag } from "@/features/config/hooks/use-flag"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { getErrorMessage } from "@/lib/api/errors"
import { deviceTimeZone } from "@/lib/device"
import { addCampus } from "../api"
import type { University } from "../types"
import { campusNameReady } from "../utils/campus-add"
import { useUniversities } from "./use-universities"

export interface CampusDraft {
  name: string
  acronym: string
}

export function useCampusSheet(
  onPick: (university: University) => void,
  {
    country = null,
    exclude = [],
    verifiedOnly = false,
  }: {
    country?: string | null
    exclude?: string[]
    verifiedOnly?: boolean
  } = {}
) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [draft, setDraft] = useState<CampusDraft | null>(null)
  const debounced = useDebouncedValue(search, 300)
  const universities = useUniversities(debounced, country, verifiedOnly)
  const canAdd = useFlag("add_campus") && !verifiedOnly
  const results = search.trim()
    ? (universities.data?.items ?? []).filter(
        (university) => !exclude.includes(university.id)
      )
    : []

  const onOpenChange = (next: boolean) => {
    setOpen(next)
    if (next) return
    setSearch("")
    setDraft(null)
    add.reset()
  }
  const select = (university: University) => {
    onOpenChange(false)
    onPick(university)
  }
  const add = useMutation({ mutationFn: addCampus, onSuccess: select })

  const sheet = {
    open,
    onOpenChange,
    search,
    onSearch: setSearch,
    searching: universities.isFetching,
    results,
    onSelect: select,
    adding: canAdd
      ? {
          draft,
          start: () => setDraft({ name: search.trim(), acronym: "" }),
          change: (patch: Partial<CampusDraft>) =>
            setDraft((current) =>
              current ? { ...current, ...patch } : current
            ),
          back: () => {
            setDraft(null)
            add.reset()
          },
          ready: draft !== null && campusNameReady(draft.name),
          submit: () => {
            if (!draft || !campusNameReady(draft.name) || add.isPending) return
            add.mutate({
              name: draft.name.trim(),
              acronym: draft.acronym.trim() || undefined,
              timeZone: deviceTimeZone(),
            })
          },
          submitting: add.isPending,
          error: add.error ? getErrorMessage(add.error) : null,
        }
      : null,
  }

  return {
    show: () => setOpen(true),
    sheet,
  }
}

export type CampusSheetState = ReturnType<typeof useCampusSheet>["sheet"]
export type CampusAdding = NonNullable<CampusSheetState["adding"]>
