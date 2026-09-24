export const referralKeys = {
  all: () => ["referrals"] as const,
  overview: () => ["referrals", "overview"] as const,
  invitees: () => ["referrals", "invitees"] as const,
  lookup: (code: string) => ["referrals", "lookup", code] as const,
}
