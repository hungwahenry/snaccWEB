import { api } from "@/lib/api/client"
import type { AdminCountry } from "../types"

export const listCountries = () => api.get<AdminCountry[]>("/admin/countries")

export const setCountryOpen = (code: string, open: boolean) =>
  api.patch<AdminCountry>(`/admin/countries/${encodeURIComponent(code)}`, {
    open,
  })

export const setCountryMinAge = (code: string, minAge: number) =>
  api.patch<AdminCountry>(
    `/admin/countries/${encodeURIComponent(code)}/min-age`,
    { minAge }
  )
