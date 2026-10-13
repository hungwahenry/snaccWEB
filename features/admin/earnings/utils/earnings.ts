import type { AdminEngagementKind } from "@/features/admin/engagement/types"
import type { Option } from "@/features/admin/shell/types"
import { parseAmount } from "@/features/admin/shell/utils/money"
import type { AdminUniversity } from "@/features/admin/universities/types"
import type { Country } from "@/features/places/types"
import { moneyToInput } from "@/lib/money"
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

export const CAP_INVALID = "Enter an amount, like 5000 or 2500.50."

export function campusCurrencies(
  universities: Pick<AdminUniversity, "id" | "country">[],
  countries: Pick<Country, "code" | "currency">[]
): Record<string, string> {
  const byCountry = new Map(
    countries.map((country) => [country.code, country.currency])
  )

  return Object.fromEntries(
    universities.flatMap((university) => {
      const currency = byCountry.get(university.country.code)
      return currency ? [[university.id, currency]] : []
    })
  )
}

export function fundDraft(fund?: AdminFund): FundDraft {
  return {
    universityId: fund?.university_id ?? "",
    cap: fund ? moneyToInput(fund.cap) : "",
  }
}

/** The fund to save, or null until a campus is picked and the cap is a real amount. */
export function toFundInput(
  draft: FundDraft,
  currency: string | null
): FundInput | null {
  if (draft.universityId === "" || currency === null) return null
  const cap = parseAmount(draft.cap, currency)

  return cap === null ? null : { universityId: draft.universityId, cap }
}

/** What is wrong with a typed cap, once something has been typed. */
export function capProblem(
  raw: string,
  currency: string | null
): string | null {
  if (currency === null || raw.trim() === "") return null
  return parseAmount(raw, currency) === null ? CAP_INVALID : null
}
