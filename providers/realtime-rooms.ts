export const realtimeRooms = {
  snacc: (id: string) => `snacc:${id}`,
  feedCountry: (countryCode: string) => `feed:country:${countryCode}`,
  feedCampus: (slug: string) => `feed:campus:${slug}`,
  profile: (username: string) => `profile:${username}`,
  match: (matchId: string) => `match:${matchId}`,
  football: "football",
} as const
