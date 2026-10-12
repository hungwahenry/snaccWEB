"use client"

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import { listCountries, setCountryOpen } from "../api"
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

  return useMemo(
    () => ({
      setOpen: (code: string, open: boolean) => setOpen({ code, open }),
    }),
    [setOpen]
  )
}
