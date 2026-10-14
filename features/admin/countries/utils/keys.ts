export const adminCountryKeys = {
  all: () => ["admin", "countries"] as const,
  list: () => ["admin", "countries", "list"] as const,
  places: (code: string) => ["admin", "countries", "places", code] as const,
}
