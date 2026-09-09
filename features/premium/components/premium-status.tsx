import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/format"
import type { Premium } from "../types"

export function PremiumStatus({ premium }: { premium: Premium }) {
  if (premium.lifetime) {
    return (
      <div className="rounded-xl border p-4">
        <Badge>Premium</Badge>
        <p className="mt-2 text-sm text-muted-foreground">
          Yours for life. Nothing to renew.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border p-4">
      <Badge>Premium</Badge>
      <p className="mt-2 text-sm text-muted-foreground">
        {premium.until ? `Runs until ${formatDate(premium.until)}.` : "Active."}
        {premium.will_renew
          ? " It renews on its own."
          : " It will not renew on its own."}
      </p>
    </div>
  )
}
