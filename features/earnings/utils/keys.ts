export const earningsKeys = {
  all: () => ["earnings"] as const,
  balance: () => ["earnings", "balance"] as const,
  fund: () => ["earnings", "fund"] as const,
  topSnaccs: () => ["earnings", "top-snaccs"] as const,
}
