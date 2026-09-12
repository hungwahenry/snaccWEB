"use client"

import { useSearchParams } from "next/navigation"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"
import { AmountStep } from "@/features/wallet/components/pay/amount-step"
import { WALLET_PATH } from "@/features/wallet/routes"
import { PAY_TITLES } from "@/features/wallet/utils/pay-copy"
import { payPrefillFrom } from "@/features/wallet/utils/pay-route"

const ignore = () => {}

export default function Loading() {
  const prefill = payPrefillFrom(Object.fromEntries(useSearchParams()))
  const title = PAY_TITLES[prefill.mode]

  return (
    <>
      <RouteBackHeader title={title} fallback={WALLET_PATH} />
      <AmountStep
        raw={prefill.amount ?? ""}
        target={null}
        resolvingTarget={Boolean(prefill.recipientId || prefill.to)}
        hint={" "}
        warning={false}
        fix={null}
        action={title}
        ready={false}
        busy={false}
        onKey={ignore}
        onNext={ignore}
      />
    </>
  )
}
