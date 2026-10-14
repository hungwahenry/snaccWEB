"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useCountryChoices } from "@/features/admin/countries/hooks/use-country-choices"
import { useDraft } from "@/features/admin/shell/hooks/use-draft"
import { LEGAL_PATH } from "@/features/admin/shell/routes"
import type { AdminLegalDocument, LegalDraft } from "../types"
import { draftFrom, isDraftReady, isPublishable } from "../utils/legal"
import { useLegalActions, useLegalDocument } from "./use-legal"

const BLANK: LegalDraft = { title: "", content: null, html: "" }

export function useLegalEditorScreen(id: string) {
  const router = useRouter()
  const query = useLegalDocument(id)
  const countries = useCountryChoices()
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
    countryNames: countries.names,
    draft,
    text,
    ready: isDraftReady(draft),
    publishable: isPublishable(draft),
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
