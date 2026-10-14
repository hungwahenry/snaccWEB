"use client"

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import {
  createCampusType,
  createRegion,
  deleteCampusType,
  deleteRegion,
  getCountryPlaces,
  listCountries,
  updateCampusType,
  updateRegion,
} from "../api"
import type { CampusTypeInput, RegionInput } from "../types"
import { adminCountryKeys } from "../utils/keys"

export function useAdminCountry(code: string) {
  return useQuery({
    queryKey: adminCountryKeys.list(),
    queryFn: listCountries,
    select: (countries) =>
      countries.find((country) => country.code === code) ?? null,
  })
}

export function useAdminCountryPlaces(code: string) {
  return useQuery({
    queryKey: adminCountryKeys.places(code),
    queryFn: () => getCountryPlaces(code),
  })
}

export function usePlaceActions(code: string) {
  const invalidates = [adminCountryKeys.places(code)]

  const { run: addRegion } = useAdminMutation({
    mutationFn: (input: RegionInput) => createRegion(code, input),
    success: (region) => `${region.name} added.`,
    invalidates,
  })
  const { run: saveRegion } = useAdminMutation({
    mutationFn: ({ id, input }: { id: string; input: RegionInput }) =>
      updateRegion(id, input),
    success: "Region saved.",
    invalidates,
  })
  const { run: removeRegion } = useAdminMutation({
    mutationFn: (id: string) => deleteRegion(id),
    success: "Region deleted.",
    invalidates,
  })
  const { run: addType } = useAdminMutation({
    mutationFn: (input: CampusTypeInput) => createCampusType(code, input),
    success: (type) => `${type.name} added.`,
    invalidates,
  })
  const { run: saveType } = useAdminMutation({
    mutationFn: ({ id, input }: { id: string; input: CampusTypeInput }) =>
      updateCampusType(id, input),
    success: "Campus type saved.",
    invalidates,
  })
  const { run: removeType } = useAdminMutation({
    mutationFn: (id: string) => deleteCampusType(id),
    success: "Campus type deleted.",
    invalidates,
  })

  return useMemo(
    () => ({
      addRegion,
      saveRegion: (id: string, input: RegionInput) => saveRegion({ id, input }),
      removeRegion,
      addType,
      saveType: (id: string, input: CampusTypeInput) => saveType({ id, input }),
      removeType,
    }),
    [addRegion, saveRegion, removeRegion, addType, saveType, removeType]
  )
}
