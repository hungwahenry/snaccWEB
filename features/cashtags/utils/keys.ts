export const cashtagKeys = {
  suggestions: (query: string) => ["cashtags", "suggest", query] as const,
  detail: (symbol: string) =>
    ["cashtags", "detail", symbol.toUpperCase()] as const,
}
