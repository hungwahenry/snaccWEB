import { api } from "@/lib/api/client"
import type {
  AdminCampusType,
  AdminCountry,
  AdminRegion,
  CampusTypeInput,
  CountryPlaces,
  RegionInput,
} from "../types"

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

export const getCountryPlaces = (code: string) =>
  api.get<CountryPlaces>(`/admin/countries/${encodeURIComponent(code)}/places`)

export const createRegion = (code: string, input: RegionInput) =>
  api.post<AdminRegion>(
    `/admin/countries/${encodeURIComponent(code)}/regions`,
    input
  )

export const updateRegion = (id: string, input: RegionInput) =>
  api.patch<AdminRegion>(`/admin/regions/${id}`, input)

export const deleteRegion = (id: string) =>
  api.del<null>(`/admin/regions/${id}`)

export const createCampusType = (code: string, input: CampusTypeInput) =>
  api.post<AdminCampusType>(
    `/admin/countries/${encodeURIComponent(code)}/campus-types`,
    input
  )

export const updateCampusType = (id: string, input: CampusTypeInput) =>
  api.patch<AdminCampusType>(`/admin/campus-types/${id}`, input)

export const deleteCampusType = (id: string) =>
  api.del<null>(`/admin/campus-types/${id}`)
