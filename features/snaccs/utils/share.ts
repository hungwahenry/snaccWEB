import { handleOf } from "@/features/users/utils/names"
import type { Snacc } from "../types"

/** The line that travels with a shared snacc: whose it is, or a nudge when it's a Ghost's. */
export function snaccShareText(
  snacc: Pick<Snacc, "anonymous" | "author">
): string {
  const who = snacc.anonymous
    ? null
    : snacc.author.display_name || handleOf(snacc.author)
  return who ? `${who} on Snacc 👀` : "Check out this snacc on Snacc 👀"
}
