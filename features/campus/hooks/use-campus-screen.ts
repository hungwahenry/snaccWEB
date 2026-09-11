"use client"

import { useShare } from "@/features/share/hooks/use-share"
import { useCampusSnaccs } from "./use-campus-snaccs"
import { useUniversity } from "./use-university"

export function useCampusScreen(slug: string) {
  const list = useCampusSnaccs(slug)
  const university = useUniversity(slug)
  const share = useShare()
  const campus = university.data ?? null
  const title = campus?.acronym ?? "Campus"

  return {
    title,
    campus,
    headerLoading: university.isPending,
    list,
    emptyDescription: `Nothing from ${title} yet.`,
    shareCampus: campus
      ? () => share.open({ kind: "campus", university: campus })
      : null,
    shareSheet: share.sheet,
  }
}
