"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { COMPLETE_PROFILE_PATH } from "@/features/onboarding/routes"
import { useNow } from "@/hooks/use-now"
import { getErrorMessage } from "@/lib/api/errors"
import { showSuccess } from "@/lib/feedback"
import { LANDING_PATH } from "@/lib/routes"
import { emailSchema, OTP_LENGTH } from "../schemas"
import type { LoginStep } from "../types"
import {
  codeDigits,
  RESEND_COOLDOWN_SECONDS,
  resendLabel,
  retryAfterSeconds,
  secondsUntil,
} from "../utils/otp"
import { useSendOtp } from "./use-send-otp"
import { useSignIn } from "./use-sign-in"

const SECOND_MS = 1000

/** Email, then the code we sent to it. Every failure is said under the field it is about. */
export function useLoginFlow(next: string) {
  const router = useRouter()
  const sendOtp = useSendOtp()
  const resendOtp = useSendOtp()
  const signIn = useSignIn()

  const [step, setStep] = useState<LoginStep>("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [resendAt, setResendAt] = useState(0)
  const now = useNow(SECOND_MS)
  const cooldown = secondsUntil(resendAt, now)

  const parsed = emailSchema.safeParse({ email })

  function waitBeforeResend(seconds: number) {
    setResendAt(Date.now() + seconds * SECOND_MS)
  }

  function openCodeStep(address: string, wait: number) {
    setEmail(address)
    setCode("")
    setError(null)
    waitBeforeResend(wait)
    setStep("code")
  }

  function submitEmail() {
    if (sendOtp.isPending) return
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid email.")
      return
    }
    const address = parsed.data.email

    sendOtp.mutate(address, {
      onSuccess: () => openCodeStep(address, RESEND_COOLDOWN_SECONDS),
      onError: (failure) => {
        // A code went out moments ago, so there is one to type in already.
        const wait = retryAfterSeconds(failure)
        if (wait) openCodeStep(address, wait)
        else setError(getErrorMessage(failure))
      },
    })
  }

  function verify(value: string) {
    if (value.length !== OTP_LENGTH || signIn.isPending) return

    signIn.mutate(
      { email, code: value },
      {
        onSuccess: (result) => {
          const done = !!result.user.profile?.completed_at
          router.replace(done ? next : COMPLETE_PROFILE_PATH)
        },
        onError: (failure) => {
          setCode("")
          setError(getErrorMessage(failure))
        },
      }
    )
  }

  function changeCode(value: string) {
    if (signIn.isPending) return
    const digits = codeDigits(value, OTP_LENGTH)
    setCode(digits)
    setError(null)
    if (digits.length === OTP_LENGTH) verify(digits)
  }

  function resend() {
    if (cooldown > 0 || resendOtp.isPending) return

    resendOtp.mutate(email, {
      onSuccess: () => {
        waitBeforeResend(RESEND_COOLDOWN_SECONDS)
        setError(null)
        showSuccess("New code sent.")
      },
      onError: (failure) => {
        const wait = retryAfterSeconds(failure)
        if (wait) waitBeforeResend(wait)
        else setError(getErrorMessage(failure))
      },
    })
  }

  return {
    step,
    error,
    back:
      step === "code"
        ? () => {
            setError(null)
            setStep("email")
          }
        : () => router.push(LANDING_PATH),

    email,
    changeEmail: (value: string) => {
      setEmail(value)
      setError(null)
    },
    canSubmitEmail: email.trim().length > 0 && !sendOtp.isPending,
    sendingCode: sendOtp.isPending,
    submitEmail,

    code,
    codeLength: OTP_LENGTH,
    changeCode,
    verify: () => verify(code),
    canVerify: code.length === OTP_LENGTH && !signIn.isPending,
    verifying: signIn.isPending,

    resendLabel: resendLabel(cooldown),
    canResend: cooldown <= 0 && !resendOtp.isPending,
    resending: resendOtp.isPending,
    resend,
  }
}
