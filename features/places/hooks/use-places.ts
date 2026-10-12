"use client"

import { useQuery } from "@tanstack/react-query"
import { HOUR_MS } from "@/lib/duration"
import { getCountryPlaces, listCountries } from "../api"
import { placeKeys } from "../utils/keys"

export function useCountries() {
  return useQuery({
    queryKey: placeKeys.countries(),
    queryFn: listCountries,
    staleTime: HOUR_MS,
  })
}

export function useCountryPlaces(code: string | null) {
  return useQuery({
    queryKey: placeKeys.country(code ?? ""),
    queryFn: () => getCountryPlaces(code!),
    enabled: code !== null,
    staleTime: HOUR_MS,
  })
}
