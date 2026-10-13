"use client"

import { useRouter } from "next/navigation"
import { useCountryChoices } from "@/features/admin/countries/hooks/use-country-choices"
import { legalDocumentPath } from "@/features/admin/shell/routes"
import {
  countryOfWhere,
  whereOptions,
} from "@/features/admin/shell/utils/where"
import type { LegalKind } from "@/features/legal/types"
import { useLegalActions, useLegalDocuments } from "./use-legal"

export function useLegalScreen() {
  const router = useRouter()
  const query = useLegalDocuments()
  const countries = useCountryChoices()
  const actions = useLegalActions({
    onStarted: (doc) => router.push(legalDocumentPath(doc.id)),
  })

  return {
    query,
    countryNames: countries.names,
    whereOptions: whereOptions(countries.options),
    start: (kind: LegalKind, where: string) => {
      const countryCode = countryOfWhere(where)
      return actions.start(countryCode ? { kind, countryCode } : { kind })
    },
  }
}
