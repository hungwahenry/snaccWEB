import { ComposerBar } from "@/components/ui/composer-bar"
import { XIcon } from "lucide-react"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"

export function MomentTextShell({
  background,
  onClose,
  children,
  bar,
}: {
  background: string
  onClose: () => void
  children: ReactNode
  bar: ReactNode
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <div
        className="flex flex-1 flex-col pt-[env(safe-area-inset-top)]"
        style={{ backgroundColor: background }}
      >
        <div className="relative flex h-16 items-center justify-center">
          <h1 className="truncate px-16 text-center text-xl font-extrabold tracking-tight text-white">
            New moment
          </h1>
          <div className="absolute inset-y-0 left-4 flex items-center">
            <Button
              variant="secondary"
              size="icon"
              onClick={onClose}
              aria-label="Close"
            >
              <XIcon className="size-6" />
            </Button>
          </div>
        </div>

        {children}
      </div>

      <ComposerBar>{bar}</ComposerBar>
    </div>
  )
}
