"use client"

import { useMe } from "@/features/auth/hooks/use-me"
import { BackHeader } from "@/features/navigation/components/back-header"
import { AmountStep } from "../components/pay/amount-step"
import { RecipientStep } from "../components/pay/recipient-step"
import { ReviewStep } from "../components/pay/review-step"
import { SentPanel } from "../components/pay/sent-panel"
import { TopUpTransfer } from "../containers/top-up-transfer"
import { WalletGate } from "../containers/wallet-gate"
import { usePayFlow } from "../hooks/pay/use-pay-flow"
import type { PayPrefill } from "../types"

export function PayScreen({ prefill }: { prefill: PayPrefill }) {
  return (
    <WalletGate>
      <Flow prefill={prefill} />
    </WalletGate>
  )
}

function Flow({ prefill }: { prefill: PayPrefill }) {
  const currency = useMe().data?.currency
  return currency ? <Steps prefill={prefill} currency={currency} /> : null
}

function Steps({
  prefill,
  currency,
}: {
  prefill: PayPrefill
  currency: string
}) {
  const flow = usePayFlow(prefill, currency)

  switch (flow.screen) {
    case "done":
      return <SentPanel {...flow.done} />
    case "transfer":
      return flow.transfer ? (
        <>
          <BackHeader title={flow.title} onBack={flow.onBack} />
          <TopUpTransfer {...flow.transfer} />
        </>
      ) : null
    case "amount":
      return (
        <>
          <BackHeader title={flow.title} onBack={flow.onBack} />
          <AmountStep {...flow.amount} />
        </>
      )
    case "review":
      return flow.review ? <ReviewStep {...flow.review} /> : null
    default:
      return <RecipientStep {...flow.recipient} />
  }
}
