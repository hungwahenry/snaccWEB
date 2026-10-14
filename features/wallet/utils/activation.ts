import type { ActivateVirtualAccountInput, Bank, Banking } from "../types"

const PHONE = /^\+?\d{10,15}$/

export interface ActivationFields {
  firstName: string
  lastName: string
  phone: string
  idNumber: string
  accountNumber: string
  bank: Bank | null
}

export interface ActivationRules {
  id: Banking["id"]
  accountNumberLength: number
  resolved: boolean
}

export const EMPTY_ACTIVATION: ActivationFields = {
  firstName: "",
  lastName: "",
  phone: "",
  idNumber: "",
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

export function activationMissing(
  fields: ActivationFields,
  rules: ActivationRules
): string | null {
  if (!nameOk(fields.firstName)) return "first name"
  if (!nameOk(fields.lastName)) return "last name"
  if (!PHONE.test(cleanPhone(fields.phone))) return "phone number"
  if (!rules.id) return null
  if (fields.idNumber.length !== rules.id.length) return rules.id.name
  if (fields.accountNumber.length !== rules.accountNumberLength)
    return "an account you own"
  if (!fields.bank) return "its bank"
  if (!rules.resolved) return "a valid account"
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
    idNumber: fields.idNumber,
    accountNumber: fields.accountNumber,
    bankCode: fields.bank?.code,
  }
}
