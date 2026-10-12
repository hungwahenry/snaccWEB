export const placeKeys = {
  countries: () => ["places", "countries"] as const,
  country: (code: string) => ["places", "country", code] as const,
}
