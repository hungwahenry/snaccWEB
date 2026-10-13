"use client"

import { useMemo } from "react"
import { countryOptions } from "@/features/admin/universities/utils/university"
import { useCountries } from "@/features/places/hooks/use-places"

export function useCountryChoices() {
  const countries = useCountries()

  return useMemo(() => {
    const options = countryOptions(countries.data ?? [])
    return {
      options,
      names: new Map(options.map((option) => [option.value, option.label])),
    }
  }, [countries.data])
}
