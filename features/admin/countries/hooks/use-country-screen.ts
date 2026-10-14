"use client"

import {
  useAdminCountry,
  useAdminCountryPlaces,
  usePlaceActions,
} from "./use-country-places"

export function useCountryScreen(code: string) {
  return {
    country: useAdminCountry(code),
    places: useAdminCountryPlaces(code),
    actions: usePlaceActions(code),
  }
}
