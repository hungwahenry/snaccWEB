import { X } from "lucide-react"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"

/** Search and filters for a list, with a reset once anything is filtered. */
export function TableToolbar({
  children,
  onReset,
}: {
  children: ReactNode
  onReset?: () => void
}) {
  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      {children}
      {onReset ? (
        <Button variant="ghost" size="sm" onClick={onReset}>
          <X />
          Reset
        </Button>
      ) : null}
    </div>
  )
}
