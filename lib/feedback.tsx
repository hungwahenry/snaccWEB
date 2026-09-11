import Link from "next/link"
import { toast } from "sonner"
import { cachedConfig } from "@/features/config/utils/flag"
import { PREMIUM_PATH } from "@/features/premium/routes"
import { offersPremium } from "@/features/premium/utils/limit"
import { getErrorMessage } from "./api/errors"

export interface ToastAction {
  label: string
  onClick: () => void
}

/**
 * Shows a failure, and offers Premium when the failure was a limit Premium raises. Reads the cache
 * rather than taking hooks, so a mutation callback or a cache patcher anywhere can use it; the
 * offer is a link for the same reason, there being no router to reach from here.
 */
export function showError(error: unknown, action?: ToastAction): void {
  const message = getErrorMessage(error)
  if (action || !offersPremium(error, cachedConfig())) {
    showErrorMessage(message, action)
    return
  }

  toast.error(message, {
    action: (
      <Link
        href={PREMIUM_PATH}
        className="ml-auto shrink-0 rounded-md bg-premium/15 px-2 py-1 text-xs font-semibold text-premium"
      >
        Get Premium
      </Link>
    ),
  })
}

export function showErrorMessage(message: string, action?: ToastAction): void {
  toast.error(message, action ? { action } : undefined)
}

export function showSuccess(message: string, description?: string): void {
  toast.success(message, description ? { description } : undefined)
}

/** Something worth knowing that is neither a success nor a failure. */
export function showNotice(message: string): void {
  toast(message)
}

/** Moderation kept something back instead of posting it. */
export function showHeld(): void {
  toast.error("Hold on 👀", {
    description: "That post was flagged for review and not posted.",
  })
}

/** A plain toast with an Undo button. Returns a function that takes the toast down. */
export function showUndo(message: string, onUndo: () => void): () => void {
  const id = toast(message, {
    action: {
      label: "Undo",
      onClick: () => {
        toast.dismiss(id)
        onUndo()
      },
    },
  })

  return () => toast.dismiss(id)
}
