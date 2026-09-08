import { CircleCheckIcon } from "lucide-react"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Spinner } from "@/components/ui/spinner"

export function ResolvedAccount({
  checking,
  name,
  bankName,
  error,
}: {
  checking: boolean
  name: string | null
  bankName?: string | null
  error: string | null
}) {
  if (checking) {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-3.5">
        <Spinner className="text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Checking that account…
        </span>
      </div>
    )
  }

  if (name) {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-3.5">
        <CircleCheckIcon className="size-6 shrink-0 text-foreground" />
        <div className="flex min-w-0 flex-1 flex-col">
          <Eyebrow>Account name</Eyebrow>
          <span className="truncate text-base font-extrabold text-foreground">
            {name}
          </span>
          {bankName ? (
            <span className="text-sm text-muted-foreground">{bankName}</span>
          ) : null}
        </div>
      </div>
    )
  }

  if (error) return <p className="px-1 text-sm text-destructive">{error}</p>

  return null
}
