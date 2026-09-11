"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { confirm } from "@/components/ui/confirm"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { usePendingVariables } from "@/hooks/use-pending-variables"
import { showErrorMessage, showSuccess, showUndo } from "@/lib/feedback"
import { formatNaira, koboToInput } from "@/lib/format"
import { cancelRequest, declineRequest, payRequest } from "../../api"
import { markRequest, mutesChanged, walletChanged } from "../../cache"
import { payPath } from "../../routes"
import type { MoneyRequest } from "../../types"
import { walletMutationKeys } from "../../utils/keys"
import { requestShortfall, topUpFor } from "../../utils/pay"
import {
  cancelTitle,
  cannotCoverMessage,
  declineTitle,
  mutedMessage,
} from "../../utils/requests"
import { useWalletOverview } from "../account/use-wallet-overview"
import { useMoneyConfirm } from "../pin/use-money-confirm"
import { useUnmute } from "./use-mutes"

interface PayableRequest {
  id: string
  amount: number
}

interface Decline {
  request: MoneyRequest
  mute: boolean
}

export function useRequestActions(options: { enabled?: boolean } = {}) {
  const router = useRouter()
  const moneyConfirm = useMoneyConfirm()
  const overview = useWalletOverview({ enabled: options.enabled })
  const minTopUp = useConfigValue("wallet.deposit.min_kobo")
  const unmute = useUnmute()

  const paying = usePendingVariables<PayableRequest>(
    walletMutationKeys.payRequest()
  )
  const declining = usePendingVariables<Decline>(
    walletMutationKeys.declineRequest()
  )
  const cancelling = usePendingVariables<MoneyRequest>(
    walletMutationKeys.cancelRequest()
  )
  const payingIds = useMemo(() => paying.map((request) => request.id), [paying])
  const busy = new Set([
    ...paying.map((request) => request.id),
    ...declining.map((input) => input.request.id),
    ...cancelling.map((request) => request.id),
  ])

  const pay = useMutation({
    mutationKey: walletMutationKeys.payRequest(),
    mutationFn: async (request: PayableRequest) => {
      const balance = overview.data?.balance
      const shortfall =
        balance === undefined ? null : requestShortfall(request.amount, balance)
      if (balance !== undefined && shortfall !== null) {
        showErrorMessage(cannotCoverMessage(request.amount, balance), {
          label: "Add money",
          onClick: () =>
            router.push(
              payPath({
                mode: "topup",
                amount: koboToInput(topUpFor(shortfall, minTopUp)),
              })
            ),
        })
        return null
      }
      return moneyConfirm.run(
        { amountKobo: request.amount, kind: "user" },
        (credential) => payRequest({ id: request.id, ...credential })
      )
    },
    onSuccess: (paid, request) => {
      if (!paid) return
      walletChanged(paid)
      markRequest(request.id, "paid")
      showSuccess(`Paid ${formatNaira(request.amount)}.`)
    },
  })

  const decline = useMutation({
    mutationKey: walletMutationKeys.declineRequest(),
    mutationFn: ({ request, mute }: Decline) =>
      declineRequest({ id: request.id, mute }),
    onSuccess: (_result, { request, mute }) => {
      markRequest(request.id, "declined")
      if (!mute) return
      mutesChanged()
      showUndo(mutedMessage(request), () => unmute(request.requester.id))
    },
  })

  const cancel = useMutation({
    mutationKey: walletMutationKeys.cancelRequest(),
    mutationFn: (request: MoneyRequest) => cancelRequest(request.id),
    onSuccess: (_result, request) => markRequest(request.id, "cancelled"),
  })

  function confirmDecline(request: MoneyRequest) {
    confirm({
      title: declineTitle(request),
      message: "Decline & mute also stops them asking you again.",
      actions: [
        {
          label: "Decline",
          onPress: () => decline.mutate({ request, mute: false }),
        },
        {
          label: "Decline & mute",
          destructive: true,
          onPress: () => decline.mutate({ request, mute: true }),
        },
      ],
    })
  }

  function confirmCancel(request: MoneyRequest) {
    confirm({
      title: cancelTitle(request),
      actions: [
        {
          label: "Cancel request",
          destructive: true,
          onPress: () => cancel.mutate(request),
        },
      ],
      cancelLabel: "Keep it",
    })
  }

  return {
    isBusy: (id: string) => busy.has(id),
    payingIds,
    pay: (request: PayableRequest) => pay.mutate(request),
    decline: confirmDecline,
    cancel: confirmCancel,
  }
}

export type RequestActions = ReturnType<typeof useRequestActions>
