"use client"

import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { AmountStep } from "../components/pay/amount-step"
import { PAY_TITLES } from "../components/pay/pay-titles"
import { RecipientStep } from "../components/pay/recipient-step"
import { ReviewStep } from "../components/pay/review-step"
import { SentPanel } from "../components/pay/sent-panel"
import { TransferDetails } from "../components/pay/transfer-details"
import { WalletGate } from "../components/shared/wallet-gate"
import { usePayFlow } from "../hooks/pay/use-pay-flow"
import { WALLET_PATH, type PayMode } from "../routes"

export function PayScreen(props: {
  mode: PayMode
  to?: string
  recipientId?: string
  conversationId?: string
  amount?: string
}) {
  return (
    <WalletGate>
      <Flow {...props} />
    </WalletGate>
  )
}

function Flow({
  mode,
  to,
  recipientId,
  conversationId,
  amount,
}: {
  mode: PayMode
  to?: string
  recipientId?: string
  conversationId?: string
  amount?: string
}) {
  const back = useBack(WALLET_PATH)
  const flow = usePayFlow(mode, {
    username: to,
    recipientId,
    conversationId,
    amount,
  })

  if (flow.done) return <SentPanel flow={flow} />

  if (flow.transfer) {
    return (
      <>
        <BackHeader title={PAY_TITLES[mode]} onBack={back} />
        <TransferDetails flow={flow} />
      </>
    )
  }

  if (flow.step === "amount") {
    return (
      <>
        <BackHeader title={PAY_TITLES[mode]} onBack={back} />
        <AmountStep flow={flow} />
      </>
    )
  }

  if (flow.step === "review") return <ReviewStep flow={flow} />

  return <RecipientStep flow={flow} />
}
