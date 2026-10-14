"use client"

import { useState } from "react"
import { useAdminCurrencies, useCurrencyActions } from "./use-currencies"

export function useCurrenciesScreen() {
  const [search, setSearch] = useState("")
  const query = useAdminCurrencies(search)
  const actions = useCurrencyActions()

  return { query, actions, search, setSearch }
}
