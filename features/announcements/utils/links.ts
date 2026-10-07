import { SITE_URL } from "@/lib/site"
import type { AnnouncementLink } from "../types"

const withoutWww = (host: string) => host.replace(/^www\./, "")

const SITE_HOST = withoutWww(new URL(SITE_URL).hostname)

export function announcementLink(url: string): AnnouncementLink | null {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }
  if (parsed.protocol !== "https:") return null

  if (withoutWww(parsed.hostname) !== SITE_HOST)
    return { kind: "web", url: parsed.href }

  const path = `/${parsed.pathname.replace(/^\/+/, "")}`
  return { kind: "app", path: `${path}${parsed.search}${parsed.hash}` }
}
