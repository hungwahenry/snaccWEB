"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { confirm } from "@/components/ui/confirm"
import { getErrorMessage } from "@/lib/api/errors"
import { formatNaira, koboToInput } from "@/lib/format"
import { cancelRequest, declineRequest, payRequest } from "../../api"
import { payPath } from "../../routes"
import type { MoneyRequest } from "../../types"
import { MUTES_KEY, REQUESTS_KEY } from "../../utils/keys"
import { walletChanged } from "../account/use-wallet-cache"
import { useWalletOverview } from "../account/use-wallet-overview"
import { useMoneyConfirm } from "../pin/use-money-confirm"
import { useUnmute } from "./use-mutes"

export function useRequestActions(options: { enabled?: boolean } = {}) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const moneyConfirm = useMoneyConfirm()
  const overview = useWalletOverview({ enabled: options.enabled })

  const refresh = () =>
    void queryClient.invalidateQueries({ queryKey: REQUESTS_KEY })

  const pay = useMutation({
    mutationFn: async (request: { id: string; amount: number }) => {
      const balance = overview.data?.balance ?? 0
      if (request.amount > balance) {
        toast.error(
          `That needs ${formatNaira(request.amount)} — you have ${formatNaira(balance)}.`,
          {
            action: {
              label: "Add money",
              onClick: () =>
                router.push(
                  payPath({
                    mode: "topup",
                    amount: koboToInput(request.amount - balance),
                  })
                ),
            },
          }
        )
        return null
      }
      return moneyConfirm.run(
        { amountKobo: request.amount, kind: "user" },
        (credential) => payRequest({ id: request.id, ...credential })
      )
    },
    onSuccess: (paid) => {
      if (!paid) return
      walletChanged(paid)
      refresh()
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const undoMute = useUnmute()

  const decline = useMutation({
    mutationFn: (input: { request: MoneyRequest; mute?: boolean }) =>
      declineRequest({ id: input.request.id, mute: input.mute }),
    onSuccess: (_, input) => {
      refresh()
      if (!input.mute) return
      void queryClient.invalidateQueries({ queryKey: MUTES_KEY })
      toast(`Muted @${input.request.requester.username}`, {
        action: {
          label: "Undo",
          onClick: () => undoMute.mutate(input.request.requester.id),
        },
      })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  function confirmDecline(request: MoneyRequest) {
    confirm({
      title: `Decline @${request.requester.username}?`,
      actions: [
        { label: "Decline", onPress: () => decline.mutate({ request }) },
        {
          label: "Decline & mute",
          destructive: true,
          onPress: () => decline.mutate({ request, mute: true }),
        },
      ],
    })
  }

  const cancel = useMutation({
    mutationFn: (request: MoneyRequest) => cancelRequest(request.id),
    onSuccess: refresh,
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  // The id in flight, not a shared boolean: one flag lit every row in the list at once.
  function inFlight(): string | null {
    if (pay.isPending) return pay.variables?.id ?? null
    if (decline.isPending) return decline.variables?.request.id ?? null
    if (cancel.isPending) return cancel.variables?.id ?? null
    return null
  }

  return {
    busyId: inFlight(),
    pay: (request: { id: string; amount: number }) => pay.mutate(request),
    decline: confirmDecline,
    cancel: (request: MoneyRequest) => cancel.mutate(request),
  }
}

export type RequestActions = ReturnType<typeof useRequestActions>
