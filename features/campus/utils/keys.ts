export const campusKeys = {
  detail: (slug: string) => ["campus", "detail", slug.toLowerCase()] as const,
}
