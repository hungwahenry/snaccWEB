import { MailIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { SettingsIntro } from "@/features/settings/components/settings-intro"

export function ChangeEmailForm({
  currentEmail,
  newEmail,
  onChangeNewEmail,
  valid,
  submitting,
  onSubmit,
}: {
  currentEmail: string | null
  newEmail: string
  onChangeNewEmail: (next: string) => void
  valid: boolean
  submitting: boolean
  onSubmit: () => void
}) {
  return (
    <form
      className="flex flex-col gap-6 px-6 pt-4 pb-8"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <SettingsIntro
        icon={MailIcon}
        title="Change your email"
        description="This becomes the address you sign in with. We'll confirm the switch on both your old and new email."
      />

      <div className="flex flex-col gap-2">
        <Eyebrow>Current email</Eyebrow>
        <div className="flex h-14 items-center rounded-full bg-muted px-5 text-base text-muted-foreground">
          {currentEmail ?? "—"}
        </div>
      </div>

      <label className="flex flex-col gap-2">
        <Eyebrow>New email</Eyebrow>
        <Input
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          placeholder="you@example.com"
          value={newEmail}
          onChange={(event) => onChangeNewEmail(event.target.value)}
          className="h-14 rounded-full px-5 text-base md:text-base"
        />
      </label>

      <p className="text-sm text-muted-foreground">
        We&apos;ll email a code to both addresses to confirm it&apos;s really
        you.
      </p>

      <Button
        type="submit"
        size="lg"
        className="h-14 text-base"
        disabled={!valid || submitting}
      >
        {submitting ? <Spinner /> : "Change email"}
      </Button>
    </form>
  )
}
