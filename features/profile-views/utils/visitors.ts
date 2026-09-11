import { compactCount, countLabel } from "@/lib/format"

function beenBy(count: number): string {
  return `${countLabel(count, "person", "people")} ${count === 1 ? "has" : "have"} been by`
}

export function visitorsButtonLabel(count: number): string {
  return count > 0
    ? countLabel(count, "profile visitor")
    : "See who visited your profile"
}

/** What the screen says while visitors are switched off. */
export function lockedCopy(total: number): {
  title: string
  description: string
} {
  if (total > 0) {
    return {
      title: beenBy(total),
      description:
        "Turn visitors on to put names to them. They’ll see you when you visit theirs.",
    }
  }
  return {
    title: "You’re browsing invisibly",
    description:
      "Nobody sees your name when you open their profile, and you don’t see who opens yours.",
  }
}

/** The note above the list about visitors who keep their names to themselves. */
export function privateVisitorsLine(anonymous: number): string | null {
  if (anonymous <= 0) return null
  return anonymous === 1
    ? "1 more visitor is browsing privately."
    : `${compactCount(anonymous)} more visitors are browsing privately.`
}

export function emptyVisitorsCopy(anonymous: number): {
  title: string
  description: string
} {
  if (anonymous > 0) {
    return {
      title: beenBy(anonymous),
      description:
        "None of them are sharing their name yet. They turn up here as they switch it on.",
    }
  }
  return {
    title: "Nobody yet",
    description: "When someone opens your profile, they turn up here.",
  }
}

/** The names beyond the free window. The count above the list stays the true one. */
export function hiddenVisitors(
  named: number,
  shown: number,
  premium: boolean
): number {
  return premium ? 0 : Math.max(named - shown, 0)
}

export function upsellTitle(hidden: number): string {
  return countLabel(hidden, "earlier visitor")
}
