"use client"

import { AuthFrame } from "../components/auth-frame"
import { SignInForm } from "../components/sign-in-form"
import { VerifyOtpForm } from "../components/verify-otp-form"
import { useLoginFlow } from "../hooks/use-login-flow"

export function LoginScreen({ next }: { next: string }) {
  const flow = useLoginFlow(next)

  return (
    <AuthFrame onBack={flow.back}>
      {flow.step === "email" ? (
        <SignInForm
          email={flow.email}
          onChangeEmail={flow.changeEmail}
          error={flow.error}
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
          error={flow.error}
          canSubmit={flow.canVerify}
          submitting={flow.verifying}
          onSubmit={flow.verify}
          resendLabel={flow.resendLabel}
          canResend={flow.canResend}
          resending={flow.resending}
          onResend={flow.resend}
        />
      )}
    </AuthFrame>
  )
}
