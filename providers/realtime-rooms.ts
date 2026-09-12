export const realtimeRooms = {
  snacc: (id: string) => `snacc:${id}`,
  feedGlobal: "feed:global",
  feedCampus: (slug: string) => `feed:campus:${slug}`,
  profile: (username: string) => `profile:${username}`,
  campus: (slug: string) => `campus:${slug}`,
  match: (matchId: string) => `match:${matchId}`,
  football: "football",
} as const
