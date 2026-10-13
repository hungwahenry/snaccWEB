"use client"

import { useSearchParams } from "next/navigation"
import { useMe } from "@/features/auth/hooks/use-me"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"
import { AmountStep } from "@/features/wallet/components/pay/amount-step"
import { WALLET_PATH } from "@/features/wallet/routes"
import { PAY_TITLES } from "@/features/wallet/utils/pay-copy"
import { payPrefillFrom } from "@/features/wallet/utils/pay-route"
import { currencySymbol } from "@/lib/money"

const ignore = () => {}

export default function Loading() {
  const prefill = payPrefillFrom(Object.fromEntries(useSearchParams()))
  const title = PAY_TITLES[prefill.mode]
  const currency = useMe().data?.currency

  return (
    <>
      <RouteBackHeader title={title} fallback={WALLET_PATH} />
      <AmountStep
        raw={prefill.amount ?? ""}
        symbol={currency ? currencySymbol(currency) : ""}
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
