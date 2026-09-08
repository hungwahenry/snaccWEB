"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import { emailSchema, OTP_LENGTH } from "../schemas"
import { useSendOtp } from "./use-send-otp"
import { useSignIn } from "./use-sign-in"

const RESEND_COOLDOWN_SECONDS = 60

export type LoginStep = "email" | "code"

export function useLoginFlow(next: string) {
  const router = useRouter()
  const sendOtp = useSendOtp()
  const resendOtp = useSendOtp()
  const signIn = useSignIn()

  const [step, setStep] = useState<LoginStep>("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [cooldown, setCooldown] = useState(0)

  const parsed = emailSchema.safeParse({ email })

  useEffect(() => {
    if (cooldown <= 0) return
    const id = setTimeout(() => setCooldown(cooldown - 1), 1000)
    return () => clearTimeout(id)
  }, [cooldown])

  function submitEmail() {
    if (!parsed.success || sendOtp.isPending) return
    const address = parsed.data.email

    sendOtp.mutate(address, {
      onSuccess: () => {
        setEmail(address)
        setCode("")
        setCooldown(RESEND_COOLDOWN_SECONDS)
        setStep("code")
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    })
  }

  function verify(value: string) {
    if (value.length !== OTP_LENGTH || signIn.isPending) return

    signIn.mutate(
      { email, code: value },
      {
        onSuccess: (result) => {
          const done = !!result.user.profile?.completed_at
          router.replace(done ? next : "/complete-profile")
        },
        onError: (error) => {
          setCode("")
          toast.error(getErrorMessage(error))
        },
      }
    )
  }

  function changeCode(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, OTP_LENGTH)
    setCode(digits)
    if (digits.length === OTP_LENGTH) verify(digits)
  }

  function resend() {
    if (cooldown > 0 || resendOtp.isPending) return

    resendOtp.mutate(email, {
      onSuccess: () => {
        setCooldown(RESEND_COOLDOWN_SECONDS)
        toast.success("New code sent.")
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    })
  }

  return {
    step,
    email,
    setEmail,
    canSubmitEmail: parsed.success && !sendOtp.isPending,
    sendingCode: sendOtp.isPending,
    submitEmail,
    backToEmail: () => setStep("email"),

    code,
    codeLength: OTP_LENGTH,
    changeCode,
    verify: () => verify(code),
    canVerify: code.length === OTP_LENGTH && !signIn.isPending,
    verifying: signIn.isPending,

    cooldown,
    canResend: cooldown <= 0 && !resendOtp.isPending,
    resending: resendOtp.isPending,
    resend,
  }
}
