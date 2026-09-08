import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

type SignInFormProps = {
  email: string
  onChangeEmail: (next: string) => void
  canSubmit: boolean
  submitting: boolean
  onSubmit: () => void
}

export function SignInForm({
  email,
  onChangeEmail,
  canSubmit,
  submitting,
  onSubmit,
}: SignInFormProps) {
  return (
    <form
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

      <Input
        type="email"
        value={email}
        onChange={(event) => onChangeEmail(event.target.value)}
        placeholder="you@university.edu"
        autoComplete="email"
        autoFocus
        className="mt-2 h-14 rounded-full px-5 text-base md:text-base"
      />

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
        <Link href="/terms" className="font-medium text-foreground">
          Terms of Use
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="font-medium text-foreground">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  )
}
