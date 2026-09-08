import { ArrowLeftIcon } from "lucide-react"
import type { ReactNode } from "react"
import { SnaccDeck } from "@/components/marketing/snacc-deck"
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
    <main className="flex min-h-dvh flex-col bg-background lg:grid lg:grid-cols-[1fr_minmax(28rem,40%)]">
      <aside className="relative hidden flex-col justify-center gap-12 overflow-hidden border-r border-border bg-muted/40 px-12 py-16 lg:flex">
        <Wordmark height={30} />

        <div className="flex flex-col gap-4">
          <h2 className="text-4xl font-extrabold tracking-tight text-balance text-foreground xl:text-5xl">
            What&apos;s happening on campus?
          </h2>
          <p className="max-w-sm text-lg leading-relaxed text-pretty text-muted-foreground">
            Share a thought, a pic, or a GIF, and see what your campus is really
            talking about right now.
          </p>
        </div>

        <div
          aria-hidden
          className="pointer-events-none -mx-16 flex justify-center"
        >
          <SnaccDeck />
        </div>
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
