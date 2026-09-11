"use client"

import { useState } from "react"
import { useDraft } from "@/features/admin/shell/hooks/use-draft"
import type { AdminPage } from "../types"
import {
  draftFrom,
  isDraftReady,
  STATUS_CHANGE,
  toPageInput,
} from "../utils/page"
import { usePageActions } from "./use-pages"

/** The page form: `page` is the saved page, or undefined while creating one. */
export function usePageEditor(page?: AdminPage, onCreated?: () => void) {
  const { draft, text, replace } = useDraft(() => draftFrom(page))
  const [loadedId, setLoadedId] = useState(page?.id)
  const actions = usePageActions(onCreated)

  // Take the page over once it loads, but not on the refetch after a save, which would wipe edits.
  if (page && page.id !== loadedId) {
    setLoadedId(page.id)
    replace(draftFrom(page))
  }

  return {
    draft,
    text,
    ready: isDraftReady(draft),
    setBody: (content: unknown, html: string) =>
      replace((current) => ({ ...current, content, html })),
    save: () =>
      page
        ? actions.update(page.id, toPageInput(draft))
        : actions.create(toPageInput(draft)),
    toggleStatus: async () => {
      if (page)
        await actions.setStatus(page.id, STATUS_CHANGE[page.status].next)
    },
  }
}
