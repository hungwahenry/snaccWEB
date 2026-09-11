"use client"

import { useEffect, useRef, useState } from "react"
import { startStepUp, verifyStepUp } from "../api"
import type { StepUpChallenge, StepUpRequest } from "../types"
import { showError } from "@/lib/feedback"

export const CODE_LENGTH = 6

export function useStepUpSheet({
  request,
  onVerified,
  onCancel,
}: {
  request: StepUpRequest | null
  onVerified: (challengeId: string) => void
  onCancel: () => void
}) {
  const done = useRef(false)
  const [challenge, setChallenge] = useState<StepUpChallenge | null>(null)
  const [codes, setCodes] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [open, setOpen] = useState(false)

  const [shownRequest, setShownRequest] = useState(request)
  if (request !== shownRequest) {
    setShownRequest(request)
    setOpen(request !== null)
    if (request) {
      setChallenge(null)
      setCodes({})
    }
  }

  useEffect(() => {
    if (!request) return

    done.current = false
    let cancelled = false
    startStepUp(request.action, request.newEmail)
      .then((next) => {
        if (!cancelled) setChallenge(next)
      })
      .catch((error) => {
        if (cancelled) return
        showError(error)
        setOpen(false)
        onCancel()
      })
    return () => {
      cancelled = true
    }
  }, [request, onCancel])

  function setCode(label: string, value: string) {
    setCodes((previous) => ({ ...previous, [label]: value }))
  }

  async function onSubmit() {
    if (!challenge || busy) return

    setBusy(true)
    try {
      let latest = challenge
      for (const target of challenge.targets) {
        if (target.verified) continue
        latest = await verifyStepUp(
          challenge.id,
          target.label,
          codes[target.label] ?? ""
        )
      }

      setChallenge(latest)
      if (latest.verified) {
        done.current = true
        setOpen(false)
        onVerified(challenge.id)
      }
    } catch (error) {
      showError(error)
    } finally {
      setBusy(false)
    }
  }

  const attempted = useRef("")
  const filled =
    challenge?.targets.every(
      (target) => target.verified || codes[target.label]?.length === CODE_LENGTH
    ) ?? false
  useEffect(() => {
    if (!filled || busy) return
    const attempt = JSON.stringify(codes)
    if (attempted.current === attempt) return
    attempted.current = attempt
    void onSubmit()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- guarded by the attempt fingerprint
  }, [filled, busy])

  function onOpenChange(next: boolean) {
    setOpen(next)
    if (!next && !done.current) onCancel()
  }

  const hint =
    request?.action === "email_change"
      ? "Enter the codes we sent to both addresses."
      : request?.action === "wallet_pin"
        ? "Enter the code we emailed you to set your wallet PIN."
        : "Enter the code we emailed you."

  return { open, onOpenChange, challenge, codes, setCode, busy, hint, onSubmit }
}
