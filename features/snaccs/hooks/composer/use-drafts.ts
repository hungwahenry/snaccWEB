"use client"

import { useQuery } from "@tanstack/react-query"
import { readDrafts, removeDraft, saveDraft } from "../../cache/drafts"
import { snaccKeys } from "../../utils/keys"

/** The drafts saved in this browser, read once and shared by every composer. */
export function useDrafts() {
  const query = useQuery({
    queryKey: snaccKeys.drafts(),
    queryFn: readDrafts,
    staleTime: Infinity,
  })

  return {
    drafts: query.data ?? [],
    hydrated: query.isSuccess,
    save: saveDraft,
    remove: removeDraft,
  }
}
