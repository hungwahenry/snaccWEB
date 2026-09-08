import { XIcon } from "lucide-react"
import type { ReactNode } from "react"
import { IconButton } from "@/components/ui/icon-button"

export function ComposerHeader({
  title,
  onClose,
  right,
}: {
  title: string
  onClose: () => void
  right?: ReactNode
}) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/90 px-3 backdrop-blur">
      <IconButton icon={XIcon} label="Close" onClick={onClose} />
      <h1 className="flex-1 text-lg font-extrabold tracking-tight text-foreground">
        {title}
      </h1>
      {right}
    </header>
  )
}
