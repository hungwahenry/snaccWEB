"use client"

import { useRouter } from "next/navigation"
import { parseAsString } from "nuqs"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import { campusImportPath } from "@/features/admin/shell/routes"
import { PAGE_SIZE } from "@/features/admin/shell/utils/list-params"
import { countryOptions } from "@/features/admin/universities/utils/university"
import { useCountries } from "@/features/places/hooks/use-places"
import type { CampusImport } from "../types"
import { useCampusImportActions, useCampusImports } from "./use-campus-imports"

const FILTERS = {
  country: parseAsString,
}

export function useCampusImportsScreen() {
  const router = useRouter()
  const list = useListParams(FILTERS)
  const query = useCampusImports({
    page: list.query.page,
    perPage: PAGE_SIZE,
    country: list.query.country ?? undefined,
  })
  const actions = useCampusImportActions()
  const countries = useCountries()
  const open = (run: CampusImport) => router.push(campusImportPath(run.id))

  return {
    list,
    query,
    countries: countryOptions(countries.data ?? []),
    importFile: async (countryCode: string, file: File) =>
      open(
        await actions.create({
          countryCode,
          fileName: file.name,
          csv: await file.text(),
        })
      ),
    checkCountry: async (countryCode: string) =>
      open(await actions.checkCountry(countryCode)),
  }
}
