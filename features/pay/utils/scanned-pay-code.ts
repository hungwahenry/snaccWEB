const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://snacc.fyi"

export function usernameFromPayCode(data: string): string | null {
  const site = new RegExp(
    `^${SITE_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/pay/([A-Za-z0-9_.]+)`
  )
  const fromSite = data.match(site)?.[1]
  if (fromSite) return fromSite

  return data.match(/^snacc:\/\/pay\?.*\bto=([A-Za-z0-9_.]+)/)?.[1] ?? null
}
