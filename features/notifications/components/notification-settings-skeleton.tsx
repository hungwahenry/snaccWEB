import { Skeleton } from "@/components/ui/skeleton"
import { SECURITY_ALERTS_NOTE } from "../utils/preferences-copy"
import { PreferenceHeader } from "./preference-row"

const ROWS = [0, 1, 2, 3, 4, 5, 6]

export function NotificationSettingsSkeleton() {
  return (
    <div className="px-6 py-6">
      <PreferenceHeader />
      {ROWS.map((row) => (
        <div key={row} className="flex items-center gap-3 py-4">
          <span className="flex-1">
            <Skeleton className="my-1 h-4 w-36 max-w-full" />
          </span>
          <span className="flex w-12 justify-center">
            <Skeleton className="h-5 w-11 rounded-full" />
          </span>
          <span className="flex w-12 justify-center">
            <Skeleton className="h-5 w-11 rounded-full" />
          </span>
        </div>
      ))}
      <p className="pt-4 text-sm text-muted-foreground">
        {SECURITY_ALERTS_NOTE}
      </p>
    </div>
  )
}
