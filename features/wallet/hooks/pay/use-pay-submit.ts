"use client"

import { useMutation } from "@tanstack/react-query"
import { signal } from "@/features/signals/utils/queue"
import { createRequest, sendToBank, sendToUser } from "../../api"
import { requestsChanged, walletChanged } from "../../cache"
import type { PayMode, SendTarget } from "../../types"
import { targetName } from "../../utils/recipients"
import { useMoneyConfirm } from "../pin/use-money-confirm"

interface Submission {
  target: SendTarget
  amountKobo: number
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
      amountKobo,
      note,
    }: Submission): Promise<string | null> => {
      const to = targetName(target)
      const trimmedNote = note.trim() || undefined

      if (mode === "request") {
        if (target.kind !== "user" || !target.user.username) return null
        await createRequest({
          username: target.user.username,
          amountKobo,
          note: trimmedNote,
          conversationId,
        })
        requestsChanged()
        signal("wallet_request", { detail: conversationId ? "dm" : "app" })
        return to
      }

      if (target.kind === "bank") {
        const sent = await confirm.run(
          { amountKobo, kind: "bank" },
          (credential) =>
            sendToBank({ amountKobo, ...target.source, ...credential })
        )
        if (!sent) return null
        walletChanged(sent)
        signal("wallet_send", { detail: "bank" })
        return to
      }

      const username = target.user.username
      if (!username) return null
      const sent = await confirm.run(
        { amountKobo, kind: "user" },
        (credential) =>
          sendToUser({
            username,
            amountKobo,
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
