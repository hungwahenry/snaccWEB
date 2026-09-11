import { HOME_PATH } from "@/features/feed/routes"

/** Where to land after signing in: only a path on this site, so a link cannot send you elsewhere. */
export function safeNextPath(next: string | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return HOME_PATH
  if (next.startsWith("/\\")) return HOME_PATH
  return next
}
