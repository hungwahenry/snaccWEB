"use client"

import { useMutation } from "@tanstack/react-query"
import { useRef, useState } from "react"
import { signal } from "@/features/signals/utils/queue"
import { showError, showSuccess } from "@/lib/feedback"
import { useStepUp } from "@/providers/step-up-provider"
import { setPin } from "../../api"
import { pinChanged } from "../../cache"
import type { PinSetupMode, PinSetupStage } from "../../types"
import { pinEntered } from "../../utils/pin"
import { usePinInput } from "./use-pin-input"

const COPY: Record<
  PinSetupMode,
  { title: string; action: string; done: string }
> = {
  setup: {
    title: "Set a wallet PIN",
    action: "Set up your PIN",
    done: "Your wallet PIN is set",
  },
  change: {
    title: "Change your wallet PIN",
    action: "Change PIN",
    done: "Your PIN is changed",
  },
}

export function usePinSetup(mode: PinSetupMode, onDone: () => void) {
  const stepUp = useStepUp()
  const [stage, setStage] = useState<PinSetupStage>("intro")
  const [first, setFirst] = useState("")
  const [error, setError] = useState<string | null>(null)
  const stepUpId = useRef<string | null>(null)
  const starting = useRef(false)

  const saving = useMutation({
    mutationFn: setPin,
    onSuccess: () => {
      pinChanged()
      signal("wallet_pin", { detail: mode })
      showSuccess(COPY[mode].done)
      onDone()
    },
    onError: (err) => {
      showError(err)
      setFirst("")
      setStage("enter")
    },
  })

  const input = usePinInput((entered) => {
    if (stage === "intro") return
    const outcome = pinEntered(stage, first, entered)
    if (outcome.kind === "confirm") {
      setFirst(outcome.first)
      setStage("confirm")
    } else if (outcome.kind === "mismatch") {
      setError(outcome.error)
      setFirst("")
      setStage("enter")
    } else if (stepUpId.current) {
      saving.mutate({ pin: outcome.pin, stepUpId: stepUpId.current })
    }
  })

  async function begin() {
    if (starting.current) return
    starting.current = true
    try {
      stepUpId.current = await stepUp("wallet_pin")
      setStage("enter")
    } catch {
      // Closing the emailed-code step just leaves the intro up.
    } finally {
      starting.current = false
    }
  }

  return {
    stage,
    copy: COPY[mode],
    pin: input.value,
    title: stage === "confirm" ? "Enter it once more" : "Choose a 6-digit PIN",
    hint: stage === "confirm" ? null : "Avoid your birthday or 123456.",
    error,
    saving: saving.isPending,
    onBegin: () => void begin(),
    onKey: (key: string) => {
      setError(null)
      input.press(key)
    },
  }
}

export type PinSetupProps = ReturnType<typeof usePinSetup>
