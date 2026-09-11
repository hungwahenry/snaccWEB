"use client"

import { useFlag } from "@/features/config/hooks/use-flag"
import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { MyEarnings } from "../containers/my-earnings"

export function EarningsScreen() {
  const back = useBack()
  const earningsEnabled = useFlag("earnings")

  return (
    <>
      <BackHeader title="Monetisation" onBack={back} />
      {earningsEnabled ? <MyEarnings /> : null}
    </>
  )
}
