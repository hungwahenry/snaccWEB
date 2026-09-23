import { handleOf } from "@/features/users/utils/names"
import type { Snacc } from "../types"

/** The line that travels with a shared snacc: whose it is. */
export function snaccShareText(snacc: Pick<Snacc, "author">): string {
  const who = snacc.author.display_name || handleOf(snacc.author)
  return who ? `${who} on Snacc 👀` : "Check out this snacc on Snacc 👀"
}
