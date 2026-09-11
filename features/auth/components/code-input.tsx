import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

/** The row of boxes an emailed code is typed into. */
export function CodeInput({
  value,
  length,
  onChange,
  label,
  autoFocus,
  invalid,
}: {
  value: string
  length: number
  onChange: (next: string) => void
  label: string
  autoFocus?: boolean
  invalid?: boolean
}) {
  return (
    <InputOTP
      maxLength={length}
      value={value}
      onChange={onChange}
      autoFocus={autoFocus}
      inputMode="numeric"
      autoComplete="one-time-code"
      aria-label={label}
      aria-invalid={invalid || undefined}
    >
      <InputOTPGroup className="w-full gap-2">
        {Array.from({ length }, (_, index) => (
          <InputOTPSlot
            key={index}
            index={index}
            aria-invalid={invalid || undefined}
            className="h-14 flex-1 rounded-2xl border-0 bg-input text-xl font-bold first:rounded-2xl last:rounded-2xl data-[active=true]:bg-accent"
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  )
}
