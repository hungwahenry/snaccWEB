"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { getErrorMessage, isApiError } from "@/lib/api/errors"
import { usePinPrompt } from "@/providers/pin-prompt-provider"
import { useStepUp } from "@/providers/step-up-provider"
import { WALLET_LIMITS_PATH, WALLET_PIN_PATH } from "../../routes"

export interface MoneyMove {
  amountKobo: number
  kind: "user" | "bank"
}

export type Credential = { pin?: string; stepUpId?: string }

/// Every move of money confirms with the PIN, or with an emailed code past the configured
/// thresholds and whenever the API insists. Returns null when the person backs out.
export function useMoneyConfirm() {
  const router = useRouter()
  const stepUp = useStepUp()
  const promptPin = usePinPrompt()
  const userThreshold = useConfigValue(
    "wallet.confirm.user_stepup_threshold_kobo"
  )
  const bankThreshold = useConfigValue(
    "wallet.confirm.bank_stepup_threshold_kobo"
  )

  function needsStepUp(move: MoneyMove): boolean {
    return (
      move.amountKobo > (move.kind === "bank" ? bankThreshold : userThreshold)
    )
  }

  async function viaStepUp(): Promise<Credential | null> {
    try {
      return { stepUpId: await stepUp("payout") }
    } catch {
      return null
    }
  }

  async function viaPin(): Promise<Credential | null> {
    const typed = await promptPin()
    return typed ? { pin: typed } : null
  }

  async function run<T>(
    move: MoneyMove,
    action: (credential: Credential) => Promise<T>
  ): Promise<T | null> {
    const credential = needsStepUp(move) ? await viaStepUp() : await viaPin()
    if (!credential) return null

    try {
      return await action(credential)
    } catch (error) {
      if (isApiError(error) && error.code === "step_up_required") {
        const escalated = await viaStepUp()
        return escalated ? action(escalated) : null
      }
      if (
        isApiError(error) &&
        (error.code === "pin_locked" || error.code === "pin_incorrect")
      ) {
        toast.error(getErrorMessage(error), {
          action: {
            label: "Reset PIN",
            onClick: () => router.push(WALLET_PIN_PATH),
          },
        })
        return null
      }
      if (isApiError(error) && error.code === "limit_reached") {
        toast.error(getErrorMessage(error), {
          action: {
            label: "Your limits",
            onClick: () => router.push(WALLET_LIMITS_PATH),
          },
        })
        return null
      }
      throw error
    }
  }

  return { run }
}
