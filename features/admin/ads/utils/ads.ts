import { plural } from "@/features/admin/shell/utils/format"
import { userHandle, userName } from "@/features/admin/shell/utils/user"
import { formatDate, formatNumber } from "@/lib/format"
import { formatMoney, money, subtractMoney } from "@/lib/money"
import type {
  AdFact,
  AdminAd,
  AdPerson,
  RejectAdInput,
  RejectDraft,
} from "../types"
import { END_REASON } from "./status"

export const REJECT_NOTE_MAX = 500

export const EMPTY_REJECTION: RejectDraft = { reasonId: null, note: "" }

export function personNote(person: AdPerson): string {
  const handle = userHandle(person)

  return person.campus ? `${handle} · ${person.campus}` : handle
}

export function moneyFacts(
  ad: Pick<
    AdminAd,
    "budget" | "spent" | "views_count" | "clicks_count" | "reach" | "settled_at"
  >
): AdFact[] {
  const left = subtractMoney(ad.budget, ad.spent)
  const unspent = money(Math.max(0, left.amount), left.currency)

  return [
    { label: "Budget", value: formatMoney(ad.budget) },
    { label: "Spent", value: formatMoney(ad.spent) },
    {
      label: ad.settled_at ? "Sent back to them" : "Left to spend",
      value: formatMoney(unspent),
    },
    { label: "Views", value: formatNumber(ad.views_count) },
    { label: "Clicks", value: formatNumber(ad.clicks_count) },
    {
      label: "Matched when sent",
      value: plural(ad.reach, "person", "people"),
    },
  ]
}

export function toRejectInput(draft: RejectDraft): RejectAdInput | null {
  if (draft.reasonId === null) return null

  return { reasonId: draft.reasonId, note: draft.note.trim() || undefined }
}

export function reviewFacts(
  ad: Pick<
    AdminAd,
    | "created_at"
    | "reviewed_at"
    | "reviewed_by"
    | "rejection"
    | "end_reason"
    | "ended_at"
    | "settled_at"
  >
): AdFact[] {
  const { rejection, end_reason: ended } = ad
  const facts: (AdFact | false)[] = [
    { label: "Sent for review", value: formatDate(ad.created_at) },
    {
      label: "Reviewed",
      value: ad.reviewed_at ? formatDate(ad.reviewed_at) : "Not yet",
    },
    ad.reviewed_by !== null && {
      label: "Reviewed by",
      value: userName(ad.reviewed_by),
    },
    rejection !== null && { label: "Rejected for", value: rejection.label },
    rejection !== null && {
      label: "They were told",
      value: rejection.description,
    },
    rejection?.note ? { label: "Note to them", value: rejection.note } : false,
    ended !== null && { label: "Ended", value: formatDate(ad.ended_at) },
    ended !== null && { label: "Why it ended", value: END_REASON[ended] },
    {
      label: "Money settled",
      value: ad.settled_at ? formatDate(ad.settled_at) : "Not yet",
    },
  ]

  return facts.filter((fact): fact is AdFact => fact !== false)
}
