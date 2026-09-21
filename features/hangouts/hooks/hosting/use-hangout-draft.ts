"use client"

import { useState } from "react"
import { useFlag } from "@/features/config/hooks/use-flag"
import { showError } from "@/lib/feedback"
import { useHangoutGate } from "@/providers/hangout-gate-provider"
import type { HangoutDraft } from "../../types"
import { freshHangout } from "../../utils/hangout-draft"
import { useHangoutEditor } from "./use-hangout-editor"
import { useHangoutLimits } from "./use-hangout-limits"

export function useHangoutDraft(seed: HangoutDraft | null = null) {
  const hangoutsEnabled = useFlag("hangouts")
  const limits = useHangoutLimits()
  const ensureAgreed = useHangoutGate()
  const [hangout, setHangout] = useState<HangoutDraft | null>(seed)

  function change(patch: Partial<HangoutDraft>) {
    setHangout((current) => (current ? { ...current, ...patch } : current))
  }

  const editor = useHangoutEditor(hangout, limits, change)

  function toggleHangout() {
    if (hangout) {
      setHangout(null)
      return
    }

    void ensureAgreed()
      .then((agreed) => {
        if (agreed) setHangout(freshHangout(limits))
      })
      .catch(showError)
  }

  return {
    hangoutsEnabled,
    hangout,
    hangoutValid: editor.valid,
    toggleHangout,
    hangoutEditor: hangout
      ? { hangout, ...editor.fields, onRemove: toggleHangout }
      : null,
    hangoutTimeSheet: editor.timeSheet,
  }
}
