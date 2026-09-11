import { isApiError } from "@/lib/api/errors"

export const RESEND_COOLDOWN_SECONDS = 60

/** Keeps the digits of what was typed or pasted, up to the code's length. */
export function codeDigits(value: string, length: number): string {
  return value.replace(/\D/g, "").slice(0, length)
}

/** Whole seconds until a moment passes, never below zero. */
export function secondsUntil(until: number, now: number): number {
  return Math.max(0, Math.ceil((until - now) / 1000))
}

/** When the server refused a new code because one went out moments ago, how long to wait. */
export function retryAfterSeconds(error: unknown): number | null {
  if (!isApiError(error) || error.code !== "otp_throttled") return null
  const errors: Record<string, unknown> = error.errors ?? {}
  const seconds = errors.retry_after_seconds
  return typeof seconds === "number" && seconds > 0 ? seconds : null
}

export function resendLabel(cooldown: number): string {
  return cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"
}
