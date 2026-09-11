"use client"

import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { PayLinkPanel } from "../components/pay-link/pay-link-panel"
import { usePayLink } from "../hooks/pay/use-pay-link"
import { WALLET_PATH } from "../routes"

export function PayLinkScreen() {
  const back = useBack(WALLET_PATH)
  const payLink = usePayLink()

  return (
    <>
      <BackHeader title="Your pay link" onBack={back} />
      {payLink ? <PayLinkPanel {...payLink} /> : null}
    </>
  )
}
