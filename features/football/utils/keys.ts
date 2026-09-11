export const footballKeys = {
  scoreboard: () => ["football", "scoreboard"] as const,
  match: (matchId: string) => ["football", "match", matchId] as const,
  snaccCounts: () => ["football", "snacc-counts"] as const,
}
