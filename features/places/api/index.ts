import { api } from "@/lib/api/client"
import type { Country, CountryPlaces } from "../types"

export const listCountries = () => api.get<Country[]>("/places/countries")

export const getCountryPlaces = (code: string) =>
  api.get<CountryPlaces>(`/places/countries/${encodeURIComponent(code)}`)
