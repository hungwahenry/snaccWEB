"use client"

import { createContext, useContext, type ReactNode } from "react"
import { HangoutGateDialog } from "@/features/hangouts/components/agreement/hangout-gate-dialog"
import {
  useAgreementGate,
  type EnsureAgreed,
} from "@/features/hangouts/hooks/agreement/use-agreement-gate"

const HangoutGateContext = createContext<EnsureAgreed | null>(null)

export function useHangoutGate(): EnsureAgreed {
  const ensure = useContext(HangoutGateContext)
  if (!ensure)
    throw new Error("useHangoutGate must be used within HangoutGateProvider")
  return ensure
}

export function HangoutGateProvider({ children }: { children: ReactNode }) {
  const gate = useAgreementGate()

  return (
    <HangoutGateContext.Provider value={gate.ensure}>
      {children}
      <HangoutGateDialog {...gate.dialog} />
    </HangoutGateContext.Provider>
  )
}
