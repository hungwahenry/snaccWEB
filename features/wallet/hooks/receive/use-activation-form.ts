"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { getErrorMessage } from "@/lib/api/errors"
import { resolveBankAccount } from "../../api"
import type { Bank } from "../../types"
import { useBanks } from "../pay/use-banks"
import { useActivateVirtualAccount } from "./use-virtual-account"

export function useActivationForm() {
  const activate = useActivateVirtualAccount()
  const requiresIdentity = useConfigValue("wallet.dva.requires_identity")
  const banks = useBanks()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [bvn, setBvn] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [bank, setBank] = useState<Bank | null>(null)
  const [bankPickerOpen, setBankPickerOpen] = useState(false)

  const resolved = useQuery({
    queryKey: ["wallet", "dva", "resolve", bank?.code, accountNumber],
    queryFn: () => resolveBankAccount({ bankCode: bank!.code, accountNumber }),
    enabled: requiresIdentity && accountNumber.length === 10 && bank !== null,
    retry: false,
  })

  const cleanPhone = phone.replace(/[\s()-]/g, "")
  const missing = !(firstName.trim().length > 1)
    ? "first name"
    : !(lastName.trim().length > 1)
      ? "last name"
      : !/^\+?\d{10,15}$/.test(cleanPhone)
        ? "phone number"
        : requiresIdentity && bvn.length !== 11
          ? "BVN"
          : requiresIdentity && accountNumber.length !== 10
            ? "an account you own"
            : requiresIdentity && bank === null
              ? "its bank"
              : requiresIdentity && !resolved.data
                ? "a valid account"
                : null

  function submit() {
    activate.mutate(
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: cleanPhone,
        ...(requiresIdentity
          ? { bvn, accountNumber, bankCode: bank?.code }
          : {}),
      },
      { onSuccess: () => toast.success("Opening your account number…") }
    )
  }

  return {
    requiresIdentity,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phone,
    setPhone,
    bvn,
    setBvn: (next: string) => setBvn(next.replace(/\D/g, "").slice(0, 11)),
    accountNumber,
    setAccountNumber: (next: string) =>
      setAccountNumber(next.replace(/\D/g, "").slice(0, 10)),
    bank,
    banks: banks.data ?? [],
    bankPickerOpen,
    setBankPickerOpen,
    selectBank: (next: Bank) => {
      setBank(next)
      setBankPickerOpen(false)
    },
    resolving: resolved.isFetching,
    resolvedName: resolved.data?.account_name ?? null,
    resolveError: resolved.isError ? getErrorMessage(resolved.error) : null,
    missing,
    submitting: activate.isPending,
    submit,
  }
}
