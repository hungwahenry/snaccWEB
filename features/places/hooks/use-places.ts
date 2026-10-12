"use client"

import { useQuery } from "@tanstack/react-query"
import { HOUR_MS } from "@/lib/duration"
import { getCountryPlaces, listCountries } from "../api"
import { placeKeys } from "../utils/keys"

const countriesQuery = {
  queryKey: placeKeys.countries(),
  queryFn: listCountries,
  staleTime: HOUR_MS,
}

export function useCountries() {
  return useQuery(countriesQuery)
}

export function useCountryName(code: string) {
  const query = useQuery({
    ...countriesQuery,
    select: (countries) =>
      countries.find((country) => country.code === code)?.name ?? null,
  })
  return query.data ?? null
}

export function useCountryPlaces(code: string | null) {
  return useQuery({
    queryKey: placeKeys.country(code ?? ""),
    queryFn: () => getCountryPlaces(code!),
    enabled: code !== null,
    staleTime: HOUR_MS,
  })
}
