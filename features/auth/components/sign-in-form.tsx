import Link from "next/link"
import { useId } from "react"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { PRIVACY_PATH, TERMS_PATH } from "@/lib/routes"

type SignInFormProps = {
  email: string
  onChangeEmail: (next: string) => void
  error: string | null
  canSubmit: boolean
  submitting: boolean
  onSubmit: () => void
}

export function SignInForm({
  email,
  onChangeEmail,
  error,
  canSubmit,
  submitting,
  onSubmit,
}: SignInFormProps) {
  const errorId = useId()

  return (
    <form
      noValidate
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
        What&apos;s your email?
      </h1>
      <p className="text-base leading-6 text-muted-foreground">
        We&apos;ll send you a 6-digit code. Nothing to remember.
      </p>

      <div className="mt-2 flex flex-col gap-2">
        <Input
          type="email"
          value={email}
          onChange={(event) => onChangeEmail(event.target.value)}
          placeholder="you@university.edu"
          autoComplete="email"
          autoFocus
          aria-label="Email"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="h-14 rounded-full px-5 text-base md:text-base"
        />
        <FieldError id={errorId} className="px-5">
          {error}
        </FieldError>
      </div>

      <Button
        type="submit"
        size="lg"
        className="h-14 text-base font-semibold"
        disabled={!canSubmit || submitting}
      >
        {submitting ? <Spinner /> : "Send code"}
      </Button>

      <p className="px-2 text-center text-xs leading-5 text-muted-foreground">
        By signing up to Snacc, you accept our{" "}
        <Link href={TERMS_PATH} className="font-medium text-foreground">
          Terms of Use
        </Link>{" "}
        and{" "}
        <Link href={PRIVACY_PATH} className="font-medium text-foreground">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  )
}
