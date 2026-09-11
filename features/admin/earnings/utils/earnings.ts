import type { AdminEngagementKind } from "@/features/admin/engagement/types"
import type { Option } from "@/features/admin/shell/types"
import { parseNaira } from "@/features/admin/shell/utils/money"
import type { AdminUniversity } from "@/features/admin/universities/types"
import { koboToInput } from "@/lib/format"
import type {
  AdminEarning,
  AdminFund,
  EarningParty,
  FundDraft,
  FundInput,
} from "../types"

export function partyHandle(party: EarningParty | null): string | null {
  if (!party) return null

  return party.username ? `@${party.username}` : party.display_name || "—"
}

/**
 * Who caused the money to move. Only a credit has an actor; a claim is the beneficiary taking their
 * own balance, and an adjustment is an admin. Saying so beats a dash that looks like missing data.
 */
export function earningCause(event: AdminEarning): string {
  if (event.actor) return partyHandle(event.actor) ?? "—"
  if (event.movement === "adjustment") {
    const by = partyHandle(event.admin)
    return by ? `Adjusted by ${by}` : "Adjusted"
  }
  if (event.movement === "claim") return "Claimed"

  return "—"
}

/** A credit is named by what earned it; the other movements are named by themselves. */
export function earningLabel(event: AdminEarning): string {
  return event.type ?? event.movement
}

/**
 * The type filter's choices, from the engagement catalog rather than a list written out here: a
 * kind added there starts paying, and a filter that does not know about it hides what it pays for.
 */
export function kindOptions(
  kinds: Pick<AdminEngagementKind, "key" | "label">[]
): Option[] {
  return kinds.map((kind) => ({ value: kind.key, label: kind.label }))
}

/** Campuses that can still be given a fund: every one not already in paid mode. */
export function unfundedOptions(
  universities: Pick<AdminUniversity, "id" | "name">[],
  funds: Pick<AdminFund, "university_id">[]
): Option[] {
  const funded = new Set(funds.map((fund) => fund.university_id))

  return universities
    .filter((university) => !funded.has(university.id))
    .map((university) => ({ value: university.id, label: university.name }))
}

export const CAP_INVALID = "Enter an amount in naira, like 5000 or 2500.50."

export function fundDraft(fund?: AdminFund): FundDraft {
  return {
    universityId: fund?.university_id ?? "",
    cap: fund ? koboToInput(fund.cap) : "",
  }
}

/** The fund to save, or null until a campus is picked and the cap is a real amount. */
export function toFundInput(draft: FundDraft): FundInput | null {
  const cap = parseNaira(draft.cap)
  if (draft.universityId === "" || cap === null) return null

  return { universityId: draft.universityId, cap }
}

/** What is wrong with a typed cap, once something has been typed. */
export function capProblem(raw: string): string | null {
  return raw.trim() !== "" && parseNaira(raw) === null ? CAP_INVALID : null
}
