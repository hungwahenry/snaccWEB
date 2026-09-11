"use client"

import { useState } from "react"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import {
  ACCOUNT_NUMBER_LENGTH,
  activationInput,
  activationMissing,
  BVN_LENGTH,
  digitsOnly,
  EMPTY_ACTIVATION,
  type ActivationFields,
} from "../../utils/activation"
import { useBankAccountName } from "../pay/use-bank-account-name"
import { useBankChoice } from "../pay/use-bank-choice"
import { useActivateVirtualAccount } from "./use-virtual-account"

type TypedField = Exclude<keyof ActivationFields, "bank">

export function useActivationForm() {
  const activate = useActivateVirtualAccount()
  const identityRequired = useConfigValue("wallet.dva.requires_identity")
  const bankChoice = useBankChoice()
  const [typed, setTyped] = useState(EMPTY_ACTIVATION)

  const fields: ActivationFields = { ...typed, bank: bankChoice.bank }
  const resolved = useBankAccountName(
    bankChoice.bank,
    fields.accountNumber,
    identityRequired
  )
  const missing = activationMissing(fields, {
    required: identityRequired,
    resolved: resolved.name !== null,
  })

  const set = (field: TypedField) => (value: string) =>
    setTyped((current) => ({ ...current, [field]: value }))

  return {
    identityRequired,
    firstName: fields.firstName,
    setFirstName: set("firstName"),
    lastName: fields.lastName,
    setLastName: set("lastName"),
    phone: fields.phone,
    setPhone: set("phone"),
    bvn: fields.bvn,
    setBvn: (value: string) => set("bvn")(digitsOnly(value, BVN_LENGTH)),
    accountNumber: fields.accountNumber,
    setAccountNumber: (value: string) =>
      set("accountNumber")(digitsOnly(value, ACCOUNT_NUMBER_LENGTH)),
    bankName: bankChoice.bank?.name ?? null,
    openBankPicker: bankChoice.open,
    bankPicker: bankChoice.picker,
    resolved,
    missing,
    submitting: activate.isPending,
    submit: () => {
      if (missing === null && !activate.isPending) {
        activate.mutate(activationInput(fields, identityRequired))
      }
    },
  }
}

export type ActivationFormProps = ReturnType<typeof useActivationForm>
