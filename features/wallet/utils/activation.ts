import type { ActivateVirtualAccountInput, Bank } from "../types"

export const BVN_LENGTH = 11
export const ACCOUNT_NUMBER_LENGTH = 10

const PHONE = /^\+?\d{10,15}$/

export interface ActivationFields {
  firstName: string
  lastName: string
  phone: string
  bvn: string
  accountNumber: string
  bank: Bank | null
}

export const EMPTY_ACTIVATION: ActivationFields = {
  firstName: "",
  lastName: "",
  phone: "",
  bvn: "",
  accountNumber: "",
  bank: null,
}

export function digitsOnly(raw: string, max: number): string {
  return raw.replace(/\D/g, "").slice(0, max)
}

export function cleanPhone(raw: string): string {
  return raw.replace(/[\s()-]/g, "")
}

function nameOk(name: string): boolean {
  return name.trim().length > 1
}

/**
 * The first thing the form still needs, in the order it is asked for, or null when it is ready.
 * With identity checks on, the account must also have resolved to a name.
 */
export function activationMissing(
  fields: ActivationFields,
  identity: { required: boolean; resolved: boolean }
): string | null {
  if (!nameOk(fields.firstName)) return "first name"
  if (!nameOk(fields.lastName)) return "last name"
  if (!PHONE.test(cleanPhone(fields.phone))) return "phone number"
  if (!identity.required) return null
  if (fields.bvn.length !== BVN_LENGTH) return "BVN"
  if (fields.accountNumber.length !== ACCOUNT_NUMBER_LENGTH)
    return "an account you own"
  if (!fields.bank) return "its bank"
  if (!identity.resolved) return "a valid account"
  return null
}

export function activationInput(
  fields: ActivationFields,
  identityRequired: boolean
): ActivateVirtualAccountInput {
  const input: ActivateVirtualAccountInput = {
    firstName: fields.firstName.trim(),
    lastName: fields.lastName.trim(),
    phone: cleanPhone(fields.phone),
  }
  if (!identityRequired) return input
  return {
    ...input,
    bvn: fields.bvn,
    accountNumber: fields.accountNumber,
    bankCode: fields.bank?.code,
  }
}
