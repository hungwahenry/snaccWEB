"use client"

import { useQuery } from "@tanstack/react-query"
import { getErrorMessage } from "@/lib/api/errors"
import { resolveBankAccount } from "../../api"
import type { Bank } from "../../types"
import { walletKeys } from "../../utils/keys"
import { isAccountNumber } from "../../utils/recipients"

export function useBankAccountName(
  bank: Bank | null,
  accountNumber: string,
  enabled = true
) {
  const number = accountNumber.trim()
  const ready = enabled && bank !== null && isAccountNumber(number)

  const resolved = useQuery({
    queryKey: walletKeys.bankAccount(bank?.code ?? "", number),
    queryFn: () =>
      resolveBankAccount({ bankCode: bank?.code ?? "", accountNumber: number }),
    enabled: ready,
    retry: false,
  })

  return {
    checking: ready && resolved.isFetching,
    name: ready ? (resolved.data?.account_name ?? null) : null,
    error: ready && resolved.isError ? getErrorMessage(resolved.error) : null,
  }
}
