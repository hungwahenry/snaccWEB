import { CheckIcon, XIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import type { InviteCodeField as Field } from "../hooks/use-invite-code-field"
import { CODE_MAX, type InviteCodeStatus } from "../utils/invite"

function StatusIcon({ status }: { status: InviteCodeStatus }) {
  if (status === "checking")
    return <Spinner className="text-muted-foreground" />
  if (status === "valid")
    return <CheckIcon className="size-5 text-foreground" />
  if (status === "invalid") return <XIcon className="size-5 text-destructive" />
  return null
}

export function InviteCodeField({ field }: { field: Field }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-foreground">
          Friend&rsquo;s code
        </span>
        <span className="text-xs text-muted-foreground">Optional</span>
      </span>
      <div className="relative">
        <Input
          value={field.value}
          onChange={(event) => field.change(event.target.value)}
          placeholder="K7PQ2MX9"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          maxLength={CODE_MAX}
          className="h-14 rounded-full px-5 pr-12 text-base font-bold tracking-widest md:text-base"
        />
        <span className="absolute inset-y-0 right-5 flex items-center">
          <StatusIcon status={field.status} />
        </span>
      </div>
      {field.message ? (
        <span
          className={cn(
            "text-xs",
            field.status === "invalid"
              ? "text-destructive"
              : "text-muted-foreground"
          )}
        >
          {field.message}
        </span>
      ) : null}
    </label>
  )
}
