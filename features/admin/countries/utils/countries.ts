import type { AdminCountry } from "../types"

export function filterCountries(
  countries: AdminCountry[],
  search: string
): AdminCountry[] {
  const term = search.trim().toLowerCase()
  if (!term) return countries
  return countries.filter(
    (country) =>
      country.name.toLowerCase().includes(term) ||
      country.code.toLowerCase() === term
  )
}

export function openMessage(country: AdminCountry): string {
  return country.open
    ? `${country.name} is open. Anyone waiting there gets an email.`
    : `${country.name} is closed. People there wait until it opens again.`
}

export function isMinAge(value: string): boolean {
  if (!/^\d{1,2}$/.test(value)) return false
  const age = Number(value)
  return age >= 0 && age <= 30
}
