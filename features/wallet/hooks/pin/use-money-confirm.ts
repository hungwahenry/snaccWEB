"use client"

import { useRouter } from "next/navigation"
import { useFlag } from "@/features/config/hooks/use-flag"
import { isApiError } from "@/lib/api/errors"
import { showError } from "@/lib/feedback"
import { usePinPrompt } from "@/providers/pin-prompt-provider"
import { useStepUp } from "@/providers/step-up-provider"
import { WALLET_LIMITS_PATH, WALLET_PIN_PATH } from "../../routes"
import type { MoneyCredential, MoneyMove } from "../../types"
import { useWalletOverview } from "../account/use-wallet-overview"

/**
 * Confirms a money move with the wallet PIN, or an emailed code above the amount that needs one,
 * then runs it. Resolves null when it was called off or already explained with a way out.
 */
export function useMoneyConfirm() {
  const router = useRouter()
  const stepUp = useStepUp()
  const promptPin = usePinPrompt()
  const thresholds = useWalletOverview({ enabled: useFlag("wallet") }).data
    ?.rules.step_up_above

  function needsStepUp(move: MoneyMove): boolean {
    return thresholds
      ? move.amount.amount > thresholds[move.kind].amount
      : false
  }

  async function viaStepUp(): Promise<MoneyCredential | null> {
    try {
      return { stepUpId: await stepUp("payout") }
    } catch {
      return null
    }
  }

  async function viaPin(): Promise<MoneyCredential | null> {
    const typed = await promptPin()
    return typed ? { pin: typed } : null
  }

  async function run<T>(
    move: MoneyMove,
    action: (credential: MoneyCredential) => Promise<T>
  ): Promise<T | null> {
    const credential = needsStepUp(move) ? await viaStepUp() : await viaPin()
    if (!credential) return null

    try {
      return await action(credential)
    } catch (error) {
      if (!isApiError(error)) throw error
      if (error.code === "step_up_required") {
        const escalated = await viaStepUp()
        return escalated ? action(escalated) : null
      }
      if (error.code === "pin_locked" || error.code === "pin_incorrect") {
        showError(error, {
          label: "Reset PIN",
          onClick: () => router.push(WALLET_PIN_PATH),
        })
        return null
      }
      if (error.code === "limit_reached") {
        showError(error, {
          label: "Your limits",
          onClick: () => router.push(WALLET_LIMITS_PATH),
        })
        return null
      }
      throw error
    }
  }

  return { run }
}
