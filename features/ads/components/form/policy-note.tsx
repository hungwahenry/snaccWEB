import { ShieldAlertIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { PolicyReason } from "../../types"

export function PolicyNote({
  reasons,
  loading,
  failed,
  onRetry,
}: {
  reasons: PolicyReason[]
  loading: boolean
  failed: boolean
  onRetry: () => void
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border p-4">
      <div className="flex items-center gap-2">
        <ShieldAlertIcon className="size-4 shrink-0 text-muted-foreground" />
        <p className="text-sm font-bold text-foreground">
          Not allowed on Snacc
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col">
          <Skeleton className="my-[3px] h-3.5 w-40" />
          <Skeleton className="my-[3px] h-3 w-full" />
          <Skeleton className="my-[3px] h-3.5 w-32" />
          <Skeleton className="my-[3px] h-3 w-2/3" />
        </div>
      ) : failed ? (
        <button
          type="button"
          onClick={onRetry}
          className="self-start text-sm font-bold text-primary hover:underline"
        >
          Couldn&apos;t load the list. Try again
        </button>
      ) : (
        <ul className="flex flex-col gap-2">
          {reasons.map((reason) => (
            <li key={reason.id} className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                {reason.label}
              </span>
              <span className="text-xs leading-5 text-pretty text-muted-foreground">
                {reason.description}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs leading-5 text-pretty text-muted-foreground">
        Snacc checks every promotion before it runs. One that breaks these rules
        isn&apos;t approved, and the whole budget comes back to you.
      </p>
    </div>
  )
}
