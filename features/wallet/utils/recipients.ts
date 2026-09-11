import { handleOf } from "@/features/users/utils/names"
import type {
  Bank,
  PartyLabel,
  Payee,
  PayMode,
  SendTarget,
  WalletRecipient,
} from "../types"

const ACCOUNT_NUMBER = /^\d{10}$/

export function isAccountNumber(value: string): boolean {
  return ACCOUNT_NUMBER.test(value.trim())
}

/** Only people can be asked for money; a bank account can only be sent to. */
export function canTarget(
  mode: PayMode,
  recipient: WalletRecipient | null
): recipient is WalletRecipient {
  return recipient !== null && (mode !== "request" || recipient.kind === "user")
}

export function recipientsFor(
  mode: PayMode,
  recipients: WalletRecipient[]
): WalletRecipient[] {
  return recipients.filter((recipient) => canTarget(mode, recipient))
}

export function targetFromRecipient(
  recipient: WalletRecipient | null
): SendTarget | null {
  if (!recipient) return null
  if (recipient.kind === "user") {
    return recipient.user ? { kind: "user", user: recipient.user } : null
  }

  const bank = recipient.bank
  if (!bank?.bank_name || !bank.account_name || !bank.account_last4) return null

  return {
    kind: "bank",
    bankName: bank.bank_name,
    accountName: bank.account_name,
    accountLast4: bank.account_last4,
    source: { recipientId: recipient.id },
  }
}

export function bankTarget(
  bank: Bank,
  accountNumber: string,
  accountName: string
): SendTarget {
  return {
    kind: "bank",
    bankName: bank.name,
    accountName,
    accountLast4: accountNumber.slice(-4),
    source: { bankCode: bank.code, accountNumber },
  }
}

/** The exact match for a username among search results, ignoring case. */
export function userNamed<T extends Payee>(
  users: T[],
  username: string
): T | null {
  const wanted = username.toLowerCase()
  return users.find((user) => user.username?.toLowerCase() === wanted) ?? null
}

export function targetLabel(target: SendTarget): PartyLabel {
  if (target.kind === "user") {
    const handle = handleOf(target.user) ?? "Someone"
    return { title: handle, subtitle: target.user.display_name, short: handle }
  }

  const number =
    "accountNumber" in target.source
      ? target.source.accountNumber
      : `••${target.accountLast4}`
  return {
    title: target.accountName,
    subtitle: `${target.bankName} · ${number}`,
    short: `${target.bankName} ••${target.accountLast4}`,
  }
}

export function recipientLabel(recipient: WalletRecipient): PartyLabel {
  if (recipient.kind === "user") {
    const handle = recipient.user
      ? (handleOf(recipient.user) ?? "Someone")
      : "Someone"
    return {
      title: handle,
      subtitle: recipient.user?.display_name ?? null,
      short: handle,
    }
  }

  const bank = recipient.bank
  const bankName = bank?.bank_name ?? "Bank"
  const ending = bank?.account_last4 ? ` ••${bank.account_last4}` : ""
  return {
    title: bank?.account_name ?? bankName,
    subtitle: `${bankName}${ending}`,
    short: bankName,
  }
}

/** Who a finished move went to, the way the done screen says it. */
export function targetName(target: SendTarget): string {
  return target.kind === "user"
    ? (handleOf(target.user) ?? "them")
    : target.accountName
}

export function forgetRecipientTitle(recipient: WalletRecipient): string {
  const label = recipientLabel(recipient)
  const who = recipient.kind === "user" ? label.title : label.subtitle
  return `Remove ${who} from recents?`
}
