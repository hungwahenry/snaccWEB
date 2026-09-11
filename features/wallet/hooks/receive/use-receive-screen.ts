"use client"

import { useState } from "react"
import { shareOrCopy } from "@/lib/share-links"
import { accountShareText } from "../../utils/format"
import { receiveView } from "../../utils/virtual-account"
import { useCopyFeedback } from "@/hooks/use-copy-feedback"
import { useVirtualAccount } from "./use-virtual-account"

export function useReceiveScreen() {
  const account = useVirtualAccount()
  const data = account.data ?? null
  const [checking, setChecking] = useState(false)
  const { copied, copy } = useCopyFeedback(data?.account_number ?? "")

  async function checkAgain() {
    if (checking) return
    setChecking(true)
    await account.refetch()
    setChecking(false)
  }

  return {
    view: receiveView({
      loading: account.isPending,
      failed: account.isError,
      account: data,
    }),
    retry: () => void account.refetch(),
    account: data,
    copied,
    onCopy: copy,
    onShare: () => {
      if (data?.account_number) {
        void shareOrCopy(
          data.account_number,
          accountShareText(data),
          "Account details"
        )
      }
    },
    checking,
    onCheckAgain: () => void checkAgain(),
    failureReason: data?.status === "failed" ? data.failure_reason : null,
  }
}
