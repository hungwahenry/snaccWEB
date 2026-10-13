"use client"

import { countryOptions } from "@/features/admin/universities/utils/university"
import { useCountries } from "@/features/places/hooks/use-places"
import { useFlagActions, useFlagGroups } from "./use-flags"

export function useFlagsScreen() {
  const countries = useCountries()

  return {
    query: useFlagGroups(),
    actions: useFlagActions(),
    countries: countryOptions(countries.data ?? []),
  }
}
