import { handleOf } from "@/features/users/utils/names"
import type { EarningEvent, EarningLine } from "../types"

const VERBS: Record<string, string> = {
  reaction: "reacted",
  resnacc: "resnacced",
  quote: "quoted your snacc",
  poll_vote: "voted in your poll",
  comment: "replied",
}

export function earningLine(
  event: Pick<EarningEvent, "type" | "actor">
): EarningLine {
  if (event.type === "bonus") return { who: null, what: "Bonus" }

  const who = event.actor ? handleOf(event.actor) : null
  const verb = (event.type && VERBS[event.type]) ?? "engaged"

  return who ? { who, what: verb } : { who: null, what: `Someone ${verb}` }
}
