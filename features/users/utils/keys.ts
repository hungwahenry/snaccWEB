export const userKeys = {
  profiles: () => ["users", "profile"] as const,
  profile: (username: string) =>
    ["users", "profile", username.toLowerCase()] as const,
  suggestions: (query: string) => ["users", "suggest", query] as const,
  usernameCheck: (username: string) =>
    ["users", "username-check", username] as const,
}
