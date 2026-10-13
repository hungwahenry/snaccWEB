"use client"

import { useMutation } from "@tanstack/react-query"
import type { Money } from "@/lib/money"
import { signal } from "@/features/signals/utils/queue"
import { createRequest, sendToBank, sendToUser } from "../../api"
import { requestsChanged, walletChanged } from "../../cache"
import type { PayMode, SendTarget } from "../../types"
import { targetName } from "../../utils/recipients"
import { useMoneyConfirm } from "../pin/use-money-confirm"

interface Submission {
  target: SendTarget
  amount: Money
  note: string
}

export function usePaySubmit(
  mode: PayMode,
  conversationId: string | undefined
) {
  const confirm = useMoneyConfirm()

  return useMutation({
    mutationFn: async ({
      target,
      amount,
      note,
    }: Submission): Promise<string | null> => {
      const to = targetName(target)
      const trimmedNote = note.trim() || undefined

      if (mode === "request") {
        if (target.kind !== "user" || !target.user.username) return null
        await createRequest({
          username: target.user.username,
          amount,
          note: trimmedNote,
          conversationId,
        })
        requestsChanged()
        signal("wallet_request", { detail: conversationId ? "dm" : "app" })
        return to
      }

      if (target.kind === "bank") {
        const sent = await confirm.run({ amount, kind: "bank" }, (credential) =>
          sendToBank({ amount, ...target.source, ...credential })
        )
        if (!sent) return null
        walletChanged(sent)
        signal("wallet_send", { detail: "bank" })
        return to
      }

      const username = target.user.username
      if (!username) return null
      const sent = await confirm.run({ amount, kind: "user" }, (credential) =>
        sendToUser({
          username,
          amount,
          conversationId,
          note: trimmedNote,
          ...credential,
        })
      )
      if (!sent) return null
      walletChanged(sent)
      signal("wallet_send", { detail: conversationId ? "dm" : "user" })
      return to
    },
  })
}
