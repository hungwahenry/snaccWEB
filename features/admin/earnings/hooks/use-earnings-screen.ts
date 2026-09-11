"use client"

import { parseAsString } from "nuqs"
import { useMemo } from "react"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import { PAGE_SIZE } from "@/features/admin/shell/utils/list-params"
import { useCampuses } from "@/features/admin/universities/hooks/use-universities"
import { unfundedOptions } from "../utils/earnings"
import {
  useEarningTypes,
  useEarnings,
  useFundActions,
  useFunds,
} from "./use-earnings"

const FILTERS = { type: parseAsString }

export function useEarningsScreen() {
  const list = useListParams(FILTERS)
  const earnings = useEarnings({
    page: list.query.page,
    perPage: PAGE_SIZE,
    type: list.query.type ?? undefined,
  })
  const funds = useFunds()
  const campuses = useCampuses()

  const fundList = funds.data
  const provision = useMemo(
    () => ({
      options: unfundedOptions(campuses.universities, fundList ?? []),
      loading: campuses.loading || fundList === undefined,
    }),
    [campuses.universities, campuses.loading, fundList]
  )

  return {
    list,
    earnings,
    types: useEarningTypes(),
    funds,
    provision,
    actions: useFundActions(),
  }
}
