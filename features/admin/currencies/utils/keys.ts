export const adminCurrencyKeys = {
  all: () => ["admin", "currencies"] as const,
  list: () => ["admin", "currencies", "list"] as const,
  settings: (code: string) =>
    ["admin", "currencies", "settings", code] as const,
  earnings: (code: string) =>
    ["admin", "currencies", "earnings", code] as const,
}
