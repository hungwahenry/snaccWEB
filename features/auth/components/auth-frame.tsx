import { ArrowLeftIcon } from "lucide-react"
import type { ReactNode } from "react"
import { HeroCopy } from "@/components/marketing/hero-copy"
import { Wordmark } from "@/components/marketing/wordmark"
import { IconButton } from "@/components/ui/icon-button"

export function AuthFrame({
  children,
  onBack,
  campuses,
}: {
  children: ReactNode
  onBack?: () => void
  campuses: number | null
}) {
  return (
    <main className="flex min-h-dvh flex-col bg-background lg:grid lg:grid-cols-[1fr_minmax(28rem,40%)]">
      <aside className="landing-frame hidden flex-col items-start justify-center gap-6 border-r border-border px-12 py-16 lg:flex">
        <Wordmark height={30} className="mb-6" />
        <HeroCopy campuses={campuses} heading="h2" />
      </aside>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pt-4 pb-8 lg:justify-center lg:px-10 lg:pt-8">
        <div className="flex h-12 items-center">
          {onBack ? (
            <IconButton icon={ArrowLeftIcon} label="Back" onClick={onBack} />
          ) : (
            <Wordmark />
          )}
        </div>
        <div className="flex flex-1 flex-col justify-center py-8 lg:flex-none lg:py-4">
          {children}
        </div>
      </div>
    </main>
  )
}
