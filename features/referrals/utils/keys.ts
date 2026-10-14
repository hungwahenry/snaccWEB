export const referralKeys = {
  all: () => ["referrals"] as const,
  overview: () => ["referrals", "overview"] as const,
  invitees: () => ["referrals", "invitees"] as const,
  inviter: (code: string) => ["referrals", "inviter", code] as const,
}
