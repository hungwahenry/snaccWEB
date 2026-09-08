"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { signal } from "@/features/signals/utils/queue"
import { getErrorMessage } from "@/lib/api/errors"
import { useStepUp } from "@/providers/step-up-provider"
import { setPin as setPinRequest } from "../../api"
import { WALLET_OVERVIEW_KEY } from "../../utils/keys"
import { usePinInput } from "./use-pin-input"

export type PinSetupStage = "intro" | "enter" | "confirm"

export function usePinSetup(mode: "setup" | "change", onDone: () => void) {
  const stepUp = useStepUp()
  const queryClient = useQueryClient()
  const [stage, setStage] = useState<PinSetupStage>("intro")
  const [first, setFirst] = useState("")
  const [error, setError] = useState<string | null>(null)
  const stepUpId = useRef<string | null>(null)
  const starting = useRef(false)

  const saving = useMutation({
    mutationFn: setPinRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: WALLET_OVERVIEW_KEY })
      signal("wallet_pin", { detail: mode })
      toast.success(
        mode === "change" ? "Your PIN is changed" : "Your wallet PIN is set"
      )
      onDone()
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
      setFirst("")
      setStage("enter")
    },
  })

  const input = usePinInput((entered) => {
    if (stage === "enter") {
      setFirst(entered)
      setStage("confirm")
      return
    }
    if (entered !== first) {
      setError("Those did not match. Start again.")
      setFirst("")
      setStage("enter")
      return
    }
    if (stepUpId.current)
      saving.mutate({ pin: entered, stepUpId: stepUpId.current })
  })

  async function begin() {
    if (starting.current) return
    starting.current = true
    try {
      stepUpId.current = await stepUp("wallet_pin")
      setStage("enter")
    } catch {
    } finally {
      starting.current = false
    }
  }

  return {
    mode,
    stage,
    pin: input.value,
    error,
    saving: saving.isPending,
    begin: () => void begin(),
    press: (key: string) => {
      setError(null)
      input.press(key)
    },
  }
}
