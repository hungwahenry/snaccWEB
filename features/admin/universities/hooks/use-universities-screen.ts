"use client"

import { parseAsString, parseAsStringLiteral } from "nuqs"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import { PAGE_SIZE } from "@/features/admin/shell/utils/list-params"
import { useCountries } from "@/features/places/hooks/use-places"
import { CAMPUS_STATUSES } from "../utils/status"
import { countryOptions } from "../utils/university"
import {
  useCampuses,
  useUniversities,
  useUniversityActions,
} from "./use-universities"

const FILTERS = {
  q: parseAsString.withDefault(""),
  status: parseAsStringLiteral(CAMPUS_STATUSES),
  country: parseAsString,
}

export function useUniversitiesScreen() {
  const list = useListParams(FILTERS)
  const query = useUniversities({
    page: list.query.page,
    perPage: PAGE_SIZE,
    q: list.query.q || undefined,
    status: list.query.status ?? undefined,
    country: list.query.country ?? undefined,
  })
  const pending = useUniversities({ page: 1, perPage: 1, status: "pending" })
  const countries = useCountries()
  const campuses = useCampuses()

  return {
    list,
    query,
    actions: useUniversityActions(),
    countries: countryOptions(countries.data ?? []),
    waiting: list.query.status === "pending" ? 0 : (pending.data?.total ?? 0),
    showWaiting: () => list.setFilter({ status: "pending" }),
    campuses: campuses.all,
  }
}
