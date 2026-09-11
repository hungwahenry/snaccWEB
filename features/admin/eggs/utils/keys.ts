export const adminEggKeys = {
  all: () => ["admin", "easter-eggs"] as const,
  list: () => ["admin", "easter-eggs", "list"] as const,
}
