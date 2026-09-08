import { ArrowLeftIcon } from "lucide-react"
import type { ReactNode } from "react"
import { Wordmark } from "@/components/marketing/wordmark"
import { IconButton } from "@/components/ui/icon-button"

export function AuthFrame({
  children,
  onBack,
}: {
  children: ReactNode
  onBack?: () => void
}) {
  return (
    <main className="flex min-h-dvh flex-col bg-background">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pt-4 pb-8">
        <div className="flex h-12 items-center">
          {onBack ? (
            <IconButton icon={ArrowLeftIcon} label="Back" onClick={onBack} />
          ) : (
            <Wordmark />
          )}
        </div>
        <div className="flex flex-1 flex-col justify-center py-8">
          {children}
        </div>
      </div>
    </main>
  )
}
