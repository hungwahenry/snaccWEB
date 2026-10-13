"use client"

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import { listCountries, setCountryMinAge, setCountryOpen } from "../api"
import { filterCountries, openMessage } from "../utils/countries"
import { adminCountryKeys } from "../utils/keys"

export function useAdminCountries(search: string) {
  return useQuery({
    queryKey: adminCountryKeys.list(),
    queryFn: listCountries,
    select: (countries) => filterCountries(countries, search),
  })
}

export function useCountryActions() {
  const { run: setOpen } = useAdminMutation({
    mutationFn: ({ code, open }: { code: string; open: boolean }) =>
      setCountryOpen(code, open),
    success: (country) => openMessage(country),
    invalidates: [adminCountryKeys.all()],
  })

  const { run: setMinAge } = useAdminMutation({
    mutationFn: ({ code, minAge }: { code: string; minAge: number }) =>
      setCountryMinAge(code, minAge),
    success: (country) =>
      `${country.name} now needs people to be ${country.min_age} or older.`,
    invalidates: [adminCountryKeys.all()],
  })

  return useMemo(
    () => ({
      setOpen: (code: string, open: boolean) => setOpen({ code, open }),
      setMinAge: (code: string, minAge: number) => setMinAge({ code, minAge }),
    }),
    [setOpen, setMinAge]
  )
}
