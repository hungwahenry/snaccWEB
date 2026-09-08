import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Spinner } from "@/components/ui/spinner"

type VerifyOtpFormProps = {
  email: string
  code: string
  codeLength: number
  onChangeCode: (next: string) => void
  canSubmit: boolean
  submitting: boolean
  onSubmit: () => void
  cooldown: number
  canResend: boolean
  resending: boolean
  onResend: () => void
}

export function VerifyOtpForm({
  email,
  code,
  codeLength,
  onChangeCode,
  canSubmit,
  submitting,
  onSubmit,
  cooldown,
  canResend,
  resending,
  onResend,
}: VerifyOtpFormProps) {
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
        Check your email
      </h1>
      <p className="text-base leading-6 text-muted-foreground">
        We sent a {codeLength}-digit code to{" "}
        <span className="font-semibold text-foreground">{email}</span>
      </p>

      <div className="mt-2">
        <InputOTP
          maxLength={codeLength}
          value={code}
          onChange={onChangeCode}
          autoFocus
          disabled={submitting}
          inputMode="numeric"
        >
          <InputOTPGroup className="w-full gap-2">
            {Array.from({ length: codeLength }, (_, index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="h-14 flex-1 rounded-2xl border-0 bg-input text-xl font-bold first:rounded-2xl last:rounded-2xl"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      <Button
        type="submit"
        size="lg"
        className="h-14 text-base font-semibold"
        disabled={!canSubmit || submitting}
      >
        {submitting ? <Spinner /> : "Verify"}
      </Button>

      <Button
        type="button"
        variant="ghost"
        disabled={!canResend || resending}
        onClick={onResend}
        className="text-sm text-muted-foreground"
      >
        {resending ? (
          <Spinner />
        ) : cooldown > 0 ? (
          `Resend code in ${cooldown}s`
        ) : (
          "Resend code"
        )}
      </Button>
    </form>
  )
}
