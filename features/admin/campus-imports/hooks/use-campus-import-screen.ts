"use client"

import { useRouter } from "next/navigation"
import { parseAsString, parseAsStringLiteral } from "nuqs"
import { useMemo } from "react"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import { CAMPUS_IMPORTS_PATH } from "@/features/admin/shell/routes"
import { PAGE_SIZE } from "@/features/admin/shell/utils/list-params"
import { useCampuses } from "@/features/admin/universities/hooks/use-universities"
import { useUniversityPlaces } from "@/features/admin/universities/hooks/use-university-places"
import type { CampusImportRowEdit } from "../types"
import {
  DECISIONS,
  importCampusOptions,
  MATCHES,
} from "../utils/campus-imports"
import {
  useCampusImport,
  useCampusImportActions,
  useCampusImportRows,
} from "./use-campus-imports"

const FILTERS = {
  q: parseAsString.withDefault(""),
  match: parseAsStringLiteral(MATCHES),
  decision: parseAsStringLiteral(DECISIONS),
}

export function useCampusImportScreen(id: string) {
  const router = useRouter()
  const list = useListParams(FILTERS)
  const query = useCampusImport(id)
  const run = query.data
  const rows = useCampusImportRows(
    id,
    run?.checked_at ?? null,
    {
      page: list.query.page,
      perPage: PAGE_SIZE,
      q: list.query.q.trim() || undefined,
      match: list.query.match ?? undefined,
      decision: list.query.decision ?? undefined,
    },
    run !== undefined && run.status !== "checking"
  )
  const actions = useCampusImportActions()
  const everyCampus = useCampuses().all
  const countryCode = run?.country.code
  const campuses = useMemo(
    () => importCampusOptions(everyCampus, countryCode),
    [everyCampus, countryCode]
  )

  return {
    query,
    rows,
    list,
    places: useUniversityPlaces(countryCode ?? ""),
    campuses,
    actions: useMemo(
      () => ({
        editRow: (rowId: string, edit: CampusImportRowEdit) =>
          actions.editRow(id, rowId, edit),
        recheck: () => actions.recheck(id),
        apply: () => actions.apply(id),
        discard: async () => {
          await actions.discard(id)
          router.push(CAMPUS_IMPORTS_PATH)
        },
      }),
      [actions, id, router]
    ),
  }
}
