export const hashtagKeys = {
  popular: () => ["hashtags", "popular"] as const,
  suggestions: (query: string) => ["hashtags", "suggest", query] as const,
}
