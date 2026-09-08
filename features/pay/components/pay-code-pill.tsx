"use client"

import { HandCoinsIcon } from "lucide-react"
import { usePayCodeInImage } from "../hooks/use-pay-code-in-image"

export function PayCodePill({
  url,
  onPay,
}: {
  url: string | null
  onPay: (username: string) => void
}) {
  const code = usePayCodeInImage(url)
  if (!code) return null

  if (code.mine) {
    return (
      <span className="flex items-center gap-2 self-center rounded-full bg-black/50 px-4 py-2.5 text-sm font-semibold text-white">
        <HandCoinsIcon className="size-4" /> Your pay code
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onPay(code.username)}
      aria-label={`Pay ${code.username}`}
      className="flex items-center gap-2 self-center rounded-full bg-white px-5 py-3 font-bold text-black transition-transform active:scale-95"
    >
      <HandCoinsIcon className="size-5" /> Pay @{code.username}
    </button>
  )
}
