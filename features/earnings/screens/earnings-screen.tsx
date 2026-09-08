"use client"

import { useFlag } from "@/features/config/hooks/use-flag"
import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { EarningsHome } from "../components/earnings-home"
import { MonetisationHome } from "../components/monetisation-home"

export function EarningsScreen() {
  const back = useBack()
  const walletEnabled = useFlag("wallet")
  const earningsEnabled = useFlag("earnings")

  return (
    <>
      <BackHeader title="Monetisation" onBack={back} />
      {!earningsEnabled ? null : walletEnabled ? (
        <MonetisationHome />
      ) : (
        <EarningsHome />
      )}
    </>
  )
}
