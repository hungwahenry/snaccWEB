import { ArrowUpIcon } from "lucide-react"
import { GhostAvatar } from "@/components/ui/ghost-avatar"
import { UserAvatar } from "@/components/ui/user-avatar"
import { cn } from "@/lib/utils"
import type { NewPoster } from "../hooks/use-feed-screen"

export function NewSnaccsPill({
  posters,
  onPress,
}: {
  posters: NewPoster[]
  onPress: () => void
}) {
  return (
    // Zero height so it never displaces the tray or the feed; sticky so it rides the scroll.
    <div className="pointer-events-none sticky top-[7.5rem] z-20 h-0 md:top-16">
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onPress}
          aria-label="Show new snaccs"
          className="pointer-events-auto flex animate-in items-center gap-2 rounded-full bg-primary px-3 py-2 text-primary-foreground shadow-lg fade-in slide-in-from-top-2 active:opacity-80"
        >
          {posters.length > 0 ? (
            <span className="flex">
              {posters.map((poster, index) => (
                <span
                  key={poster.key}
                  className={cn(
                    "overflow-hidden rounded-full border-2 border-background",
                    index > 0 && "-ml-2"
                  )}
                >
                  {poster.key === "ghost" ? (
                    <GhostAvatar className="size-6" iconClassName="size-3.5" />
                  ) : (
                    <UserAvatar
                      alt="New poster"
                      avatarUrl={poster.avatarUrl}
                      className="size-6"
                      textClassName="text-[10px]"
                    />
                  )}
                </span>
              ))}
            </span>
          ) : null}
          <ArrowUpIcon className="size-[18px]" />
        </button>
      </div>
    </div>
  )
}
