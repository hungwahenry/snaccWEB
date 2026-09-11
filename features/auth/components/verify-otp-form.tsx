import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { CodeInput } from "./code-input"

type VerifyOtpFormProps = {
  email: string
  code: string
  codeLength: number
  onChangeCode: (next: string) => void
  error: string | null
  canSubmit: boolean
  submitting: boolean
  onSubmit: () => void
  resendLabel: string
  canResend: boolean
  resending: boolean
  onResend: () => void
}

export function VerifyOtpForm({
  email,
  code,
  codeLength,
  onChangeCode,
  error,
  canSubmit,
  submitting,
  onSubmit,
  resendLabel,
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

      <div className="mt-2 flex flex-col gap-2">
        <CodeInput
          value={code}
          length={codeLength}
          onChange={onChangeCode}
          label="Login code"
          invalid={!!error}
          autoFocus
        />
        <FieldError className="px-1">{error}</FieldError>
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
        {resending ? <Spinner /> : resendLabel}
      </Button>
    </form>
  )
}
