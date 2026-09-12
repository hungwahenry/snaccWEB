import { GhostAvatar } from "@/components/ui/ghost-avatar"

export function AnonymousNote() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-10 text-center">
      <GhostAvatar className="size-16" iconClassName="size-8" />
      <p className="text-base leading-5 text-foreground">
        They&apos;ll see an anonymous ghost, never you, until you choose to
        reveal yourself.
      </p>
    </div>
  )
}
