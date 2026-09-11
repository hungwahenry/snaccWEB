export const searchKeys = {
  hashtags: (q: string) => ["search", "hashtags", q] as const,
  campuses: (q: string) => ["search", "campuses", q] as const,
}
