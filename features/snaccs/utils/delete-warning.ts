import { stateAt } from "@/features/hangouts/utils/hangouts"
import type { Snacc } from "../types"

export function deleteWarning(
  snacc: Pick<Snacc, "comments_count" | "hangout">,
  now = Date.now()
): string {
  const callsOff =
    snacc.hangout !== null &&
    ["upcoming", "happening"].includes(stateAt(snacc.hangout, now))

  return [
    callsOff ? "This calls off the hangout and tells everyone going." : null,
    snacc.comments_count > 0 ? "Its replies go with it." : null,
    "This cannot be undone.",
  ]
    .filter((line): line is string => line !== null)
    .join(" ")
}
