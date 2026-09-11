export const adminPageKeys = {
  all: () => ["admin", "pages"] as const,
  list: () => ["admin", "pages", "list"] as const,
  detail: (id: string) => ["admin", "pages", "detail", id] as const,
}
