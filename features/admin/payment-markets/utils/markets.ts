import { parseJsonObject, prettyJson } from "@/features/admin/shell/utils/json"
import { parseWholeNumber } from "@/features/admin/shell/utils/number"
import type { DepositMethod, PayoutMethod } from "@/features/wallet/types"
import type {
  AdminPaymentMarket,
  MarketDraft,
  PaymentProviderOption,
  ProviderSetting,
  UpsertMarketInput,
} from "../types"

export const DEPOSIT_METHODS: { value: DepositMethod; label: string }[] = [
  { value: "bank_transfer", label: "Top-ups by bank transfer" },
  { value: "dedicated_account", label: "Personal account numbers" },
]

export const PAYOUT_METHODS: { value: PayoutMethod; label: string }[] = [
  { value: "bank_account", label: "Sends to bank accounts" },
]

const LENGTH = { min: 4, max: 30 }

export function draftFrom(market?: AdminPaymentMarket): MarketDraft {
  return {
    country: market?.country_code ?? null,
    provider: market?.provider_key ?? null,
    deposits: market?.deposit_methods ?? [],
    payouts: market?.payout_methods ?? [],
    accountNumberLength: market ? String(market.account_number_length) : "",
    idName: market?.id_name ?? "",
    idLength: market?.id_length ? String(market.id_length) : "",
    settings: market ? prettyJson(market.provider_settings) : "{}",
  }
}

export function toggled<T>(list: T[], item: T, on: boolean): T[] {
  return on
    ? [...new Set([...list, item])]
    : list.filter((each) => each !== item)
}

export type MarketParse =
  | { ok: true; country: string; input: UpsertMarketInput }
  | { ok: false; message: string | null }

export function parseDraft(draft: MarketDraft): MarketParse {
  if (!draft.country || !draft.provider) return { ok: false, message: null }

  const accountNumberLength = parseWholeNumber(
    draft.accountNumberLength,
    LENGTH
  )
  if (accountNumberLength === null) {
    return {
      ok: false,
      message: "Give account numbers a length from 4 to 30 digits.",
    }
  }

  const idName = draft.idName.trim()
  const idLength =
    draft.idLength.trim() === ""
      ? null
      : parseWholeNumber(draft.idLength, LENGTH)
  if ((idName === "") !== (idLength === null)) {
    return {
      ok: false,
      message: "Give the ID a name and a length from 4 to 30, or neither.",
    }
  }

  const settings = parseJsonObject(draft.settings)
  if (!settings.ok) {
    return { ok: false, message: "Provider settings must be a JSON object." }
  }

  return {
    ok: true,
    country: draft.country,
    input: {
      providerKey: draft.provider,
      depositMethods: draft.deposits,
      payoutMethods: draft.payouts,
      accountNumberLength,
      idName: idName === "" ? null : idName,
      idLength,
      providerSettings: settings.value,
    },
  }
}

export function methodsLine(market: AdminPaymentMarket): string {
  const labels = [
    ...DEPOSIT_METHODS.filter((method) =>
      market.deposit_methods.includes(method.value)
    ),
    ...PAYOUT_METHODS.filter((method) =>
      market.payout_methods.includes(method.value)
    ),
  ].map((method) => method.label)
  return labels.length === 0 ? "Nothing yet" : labels.join(" · ")
}

export function idLine(market: AdminPaymentMarket): string {
  return market.id_name && market.id_length
    ? `${market.id_name}, ${market.id_length} digits`
    : "None asked"
}

export function neededSettings(
  provider: PaymentProviderOption | undefined,
  draft: Pick<MarketDraft, "deposits" | "payouts">
): ProviderSetting[] {
  const methods: string[] = [...draft.deposits, ...draft.payouts]
  return (provider?.settings ?? []).filter(
    (setting) => setting.only_for === null || methods.includes(setting.only_for)
  )
}

export function settingsHint(
  provider: PaymentProviderOption | undefined,
  needed: ProviderSetting[]
): string {
  if (!provider)
    return "The provider's own names for things here, read only by its code."
  if (needed.length === 0) return `${provider.name} needs no settings for this.`
  return `${provider.name} needs ${needed
    .map((setting) => `"${setting.key}": ${setting.hint}`)
    .join(" ")}`
}
