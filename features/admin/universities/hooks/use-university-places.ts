"use client"

import {
  useCountries,
  useCountryPlaces,
} from "@/features/places/hooks/use-places"
import {
  campusTypeChoices,
  countryOptions,
  regionChoices,
} from "../utils/university"

export function useUniversityPlaces(countryCode: string) {
  const countries = useCountries()
  const places = useCountryPlaces(countryCode || null)

  return {
    countries: countryOptions(countries.data ?? []),
    regions: regionChoices(places.data),
    campusTypes: campusTypeChoices(places.data),
  }
}
