"use client"

import { useState } from "react"
import { useAdminCountries, useCountryActions } from "./use-countries"

export function useCountriesScreen() {
  const [search, setSearch] = useState("")
  const query = useAdminCountries(search)
  const actions = useCountryActions()

  return { query, actions, search, setSearch }
}
