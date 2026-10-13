"use client"

import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { legalDocumentPath } from "@/features/admin/shell/routes"
import { countryOptions } from "@/features/admin/universities/utils/university"
import type { LegalKind } from "@/features/legal/types"
import { useCountries } from "@/features/places/hooks/use-places"
import { DEFAULT_SET, whereOptions } from "../utils/legal"
import { useLegalActions, useLegalDocuments } from "./use-legal"

export function useLegalScreen() {
  const router = useRouter()
  const query = useLegalDocuments()
  const countries = useCountries()
  const actions = useLegalActions({
    onStarted: (doc) => router.push(legalDocumentPath(doc.id)),
  })
  const options = useMemo(
    () => countryOptions(countries.data ?? []),
    [countries.data]
  )

  return {
    query,
    countryNames: useMemo(
      () => new Map(options.map((option) => [option.value, option.label])),
      [options]
    ),
    whereOptions: whereOptions(options),
    start: (kind: LegalKind, where: string) =>
      actions.start({
        kind,
        ...(where === DEFAULT_SET ? {} : { countryCode: where }),
      }),
  }
}
