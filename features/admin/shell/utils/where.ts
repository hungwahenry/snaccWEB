import type { Option } from "../types"

export const DEFAULT_SET = "default"

const DEFAULT_LABEL = "Default, everywhere without its own"

export function whereLabel(
  countryCode: string | null,
  countries: ReadonlyMap<string, string>
): string {
  if (!countryCode) return DEFAULT_LABEL
  return countries.get(countryCode) ?? countryCode
}

export function whereOptions(countries: Option[]): Option[] {
  return [{ value: DEFAULT_SET, label: DEFAULT_LABEL }, ...countries]
}

export function countryOfWhere(where: string): string | null {
  return where === DEFAULT_SET ? null : where
}
