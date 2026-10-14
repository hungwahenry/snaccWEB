"use client"

import { useState } from "react"
import {
  activationInput,
  activationMissing,
  digitsOnly,
  EMPTY_ACTIVATION,
  type ActivationFields,
} from "../../utils/activation"
import { useWalletOverview } from "../account/use-wallet-overview"
import { useBankAccountName } from "../pay/use-bank-account-name"
import { useBankChoice } from "../pay/use-bank-choice"
import { useActivateVirtualAccount } from "./use-virtual-account"

type TypedField = Exclude<keyof ActivationFields, "bank">

export function useActivationForm() {
  const activate = useActivateVirtualAccount()
  const banking = useWalletOverview().data?.banking ?? null
  const id = banking?.id ?? null
  const accountNumberLength = banking?.account_number_length ?? 0
  const bankChoice = useBankChoice()
  const [typed, setTyped] = useState(EMPTY_ACTIVATION)

  const fields: ActivationFields = { ...typed, bank: bankChoice.bank }
  const resolved = useBankAccountName(
    bankChoice.bank,
    fields.accountNumber,
    accountNumberLength,
    id !== null
  )
  const missing = activationMissing(fields, {
    id,
    accountNumberLength,
    resolved: resolved.name !== null,
  })

  const set = (field: TypedField) => (value: string) =>
    setTyped((current) => ({ ...current, [field]: value }))

  return {
    id,
    firstName: fields.firstName,
    setFirstName: set("firstName"),
    lastName: fields.lastName,
    setLastName: set("lastName"),
    phone: fields.phone,
    setPhone: set("phone"),
    idNumber: fields.idNumber,
    setIdNumber: (value: string) =>
      set("idNumber")(digitsOnly(value, id?.length ?? 0)),
    accountNumber: fields.accountNumber,
    setAccountNumber: (value: string) =>
      set("accountNumber")(digitsOnly(value, accountNumberLength)),
    bankName: bankChoice.bank?.name ?? null,
    openBankPicker: bankChoice.open,
    bankPicker: bankChoice.picker,
    resolved,
    missing,
    submitting: activate.isPending,
    submit: () => {
      if (missing === null && !activate.isPending) {
        activate.mutate(activationInput(fields, id !== null))
      }
    },
  }
}

export type ActivationFormProps = ReturnType<typeof useActivationForm>
