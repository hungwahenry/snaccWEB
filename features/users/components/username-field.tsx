import { CheckIcon, XIcon } from "lucide-react"
import { useId } from "react"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import type { UsernameStatus } from "../utils/username"

type UsernameFieldProps = {
  value: string
  status: UsernameStatus
  message: string | null
  maxLength: number
  onChange: (next: string) => void
  autoFocus?: boolean
}

export function UsernameField({
  value,
  status,
  message,
  maxLength,
  onChange,
  autoFocus,
}: UsernameFieldProps) {
  const messageId = useId()

  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-foreground">Username</span>
      <div className="relative">
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="ada_lovelace"
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="username"
          spellCheck={false}
          autoFocus={autoFocus}
          maxLength={maxLength}
          aria-invalid={message ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className="h-14 rounded-full px-5 pr-12 text-base md:text-base"
        />
        <span className="absolute inset-y-0 right-5 flex items-center">
          <UsernameStatusIcon status={status} />
        </span>
      </div>
      {message ? (
        <span id={messageId} className="px-5 text-xs text-destructive">
          {message}
        </span>
      ) : null}
    </label>
  )
}

function UsernameStatusIcon({ status }: { status: UsernameStatus }) {
  if (status === "idle") return null
  if (status === "checking")
    return <Spinner className="text-muted-foreground" />
  if (status === "available")
    return (
      <CheckIcon
        role="img"
        aria-label="Available"
        className="size-5 text-foreground"
      />
    )
  return (
    <XIcon
      role="img"
      aria-label="Not available"
      className="size-5 text-destructive"
    />
  )
}
