import { CheckIcon, XIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import type { UsernameStatus } from "../schemas"

type UsernameFieldProps = {
  value: string
  status: UsernameStatus
  maxLength: number
  onChange: (next: string) => void
}

export function UsernameField({
  value,
  status,
  maxLength,
  onChange,
}: UsernameFieldProps) {
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
          maxLength={maxLength}
          className="h-14 rounded-full px-5 pr-12 text-base md:text-base"
        />
        <span className="absolute inset-y-0 right-5 flex items-center">
          <UsernameStatusIcon status={status} />
        </span>
      </div>
    </label>
  )
}

function UsernameStatusIcon({ status }: { status: UsernameStatus }) {
  if (status === "idle") return null
  if (status === "checking")
    return <Spinner className="text-muted-foreground" />
  if (status === "available")
    return <CheckIcon className="size-5 text-foreground" />
  return <XIcon className="size-5 text-destructive" />
}
