"use client"

import { useRouter } from "next/navigation"
import { AuthFrame } from "../components/auth-frame"
import { SignInForm } from "../components/sign-in-form"
import { VerifyOtpForm } from "../components/verify-otp-form"
import { useLoginFlow } from "../hooks/use-login-flow"

export function LoginScreen({ next }: { next: string }) {
  const router = useRouter()
  const flow = useLoginFlow(next)

  return (
    <AuthFrame
      onBack={flow.step === "code" ? flow.backToEmail : () => router.push("/")}
    >
      {flow.step === "email" ? (
        <SignInForm
          email={flow.email}
          onChangeEmail={flow.setEmail}
          canSubmit={flow.canSubmitEmail}
          submitting={flow.sendingCode}
          onSubmit={flow.submitEmail}
        />
      ) : (
        <VerifyOtpForm
          email={flow.email}
          code={flow.code}
          codeLength={flow.codeLength}
          onChangeCode={flow.changeCode}
          canSubmit={flow.canVerify}
          submitting={flow.verifying}
          onSubmit={flow.verify}
          cooldown={flow.cooldown}
          canResend={flow.canResend}
          resending={flow.resending}
          onResend={flow.resend}
        />
      )}
    </AuthFrame>
  )
}
