export const adminLegalKeys = {
  all: () => ["admin", "legal"] as const,
  list: () => ["admin", "legal", "list"] as const,
  detail: (id: string) => ["admin", "legal", "detail", id] as const,
}
