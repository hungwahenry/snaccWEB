import type { ReactNode } from "react"
import { Wordmark } from "@/components/marketing/wordmark"

/// The home header: the mark centred, one action on each side. Only the phone shows it; the
/// sidebar already carries the mark on a wide screen.
export function AppHeader({
  left,
  right,
}: {
  left?: ReactNode
  right?: ReactNode
}) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-center bg-background/90 backdrop-blur md:hidden">
      <Wordmark href="/home" height={26} />
      {left ? (
        <div className="absolute inset-y-0 left-3 flex items-center">
          {left}
        </div>
      ) : null}
      {right ? (
        <div className="absolute inset-y-0 right-3 flex items-center">
          {right}
        </div>
      ) : null}
    </header>
  )
}
