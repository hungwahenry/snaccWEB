"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { useDraft } from "@/features/admin/shell/hooks/use-draft"
import { LEGAL_PATH } from "@/features/admin/shell/routes"
import { countryOptions } from "@/features/admin/universities/utils/university"
import { useCountries } from "@/features/places/hooks/use-places"
import type { AdminLegalDocument, LegalDraft } from "../types"
import { draftFrom, isDraftReady } from "../utils/legal"
import { useLegalActions, useLegalDocument } from "./use-legal"

const BLANK: LegalDraft = { title: "", content: null, html: "" }

export function useLegalEditorScreen(id: string) {
  const router = useRouter()
  const query = useLegalDocument(id)
  const countries = useCountries()
  const actions = useLegalActions({
    onDeleted: () => router.replace(LEGAL_PATH),
  })
  const { draft, text, replace } = useDraft<LegalDraft>(BLANK)
  const [loadedId, setLoadedId] = useState<string | null>(null)

  const doc: AdminLegalDocument | undefined = query.data
  if (doc && doc.id !== loadedId) {
    setLoadedId(doc.id)
    replace(draftFrom(doc))
  }

  return {
    query,
    countryNames: useMemo(
      () =>
        new Map(
          countryOptions(countries.data ?? []).map((option) => [
            option.value,
            option.label,
          ])
        ),
      [countries.data]
    ),
    draft,
    text,
    ready: isDraftReady(draft),
    setBody: (content: unknown, html: string) =>
      replace((current) => ({ ...current, content, html })),
    save: () => actions.save(id, draft),
    publish: async () => {
      await actions.save(id, draft)
      await actions.publish(id)
    },
    remove: () => actions.remove(id),
  }
}
