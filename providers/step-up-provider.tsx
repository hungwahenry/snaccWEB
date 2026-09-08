"use client"

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { StepUpSheet } from "@/features/stepup/components/step-up-sheet"
import {
  CODE_LENGTH,
  useStepUpSheet,
} from "@/features/stepup/hooks/use-step-up-sheet"
import type { StepUpAction, StepUpRequest } from "@/features/stepup/types"

type StepUpFn = (
  action: StepUpAction,
  options?: { newEmail?: string }
) => Promise<string>

const StepUpContext = createContext<StepUpFn | null>(null)

export function useStepUp(): StepUpFn {
  const stepUp = useContext(StepUpContext)
  if (!stepUp) throw new Error("useStepUp must be used within StepUpProvider")
  return stepUp
}

export function StepUpProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<StepUpRequest | null>(null)
  const resolver = useRef<{
    resolve: (id: string) => void
    reject: (reason?: unknown) => void
  } | null>(null)

  const stepUp = useCallback<StepUpFn>(
    (action, options) =>
      new Promise<string>((resolve, reject) => {
        resolver.current = { resolve, reject }
        setRequest({ action, newEmail: options?.newEmail })
      }),
    []
  )

  const onVerified = useCallback((challengeId: string) => {
    const pending = resolver.current
    resolver.current = null
    setRequest(null)
    pending?.resolve(challengeId)
  }, [])

  const onCancel = useCallback(() => {
    const pending = resolver.current
    resolver.current = null
    setRequest(null)
    pending?.reject(new Error("cancelled"))
  }, [])

  const sheet = useStepUpSheet({ request, onVerified, onCancel })

  return (
    <StepUpContext.Provider value={stepUp}>
      {children}
      <StepUpSheet
        open={sheet.open}
        onOpenChange={sheet.onOpenChange}
        challenge={sheet.challenge}
        codes={sheet.codes}
        codeLength={CODE_LENGTH}
        hint={sheet.hint}
        busy={sheet.busy}
        onCode={sheet.setCode}
        onSubmit={() => void sheet.onSubmit()}
      />
    </StepUpContext.Provider>
  )
}
