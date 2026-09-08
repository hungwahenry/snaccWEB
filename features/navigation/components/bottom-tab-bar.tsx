import { GhostIcon, PlusIcon } from "lucide-react"
import Link from "next/link"
import { CountBadge } from "@/components/ui/count-badge"
import { cn } from "@/lib/utils"
import type { NavItem } from "@/features/navigation/types"
import { NavAvatar } from "./nav-avatar"

type BottomTabBarProps = {
  items: NavItem[]
  activeKey: string | null
  ghostActive: boolean
  onCompose: () => void
}

export function BottomTabBar({
  items,
  activeKey,
  ghostActive,
  onCompose,
}: BottomTabBarProps) {
  const middle = Math.ceil(items.length / 2)

  const tab = (item: NavItem) => {
    const active = item.key === activeKey
    const Icon = item.icon
    return (
      <Link
        key={item.key}
        href={item.href}
        aria-label={item.label}
        aria-current={active ? "page" : undefined}
        className="flex flex-1 items-center justify-center py-2 active:opacity-60"
      >
        <span className="relative">
          {item.badge ? <CountBadge count={item.badge} /> : null}
          {item.avatarUrl !== undefined ? (
            <NavAvatar
              avatarUrl={item.avatarUrl}
              fallback={item.avatarFallback ?? "?"}
              active={active}
            />
          ) : (
            <Icon
              className={cn(
                "size-7",
                active ? "text-foreground" : "text-muted-foreground"
              )}
            />
          )}
        </span>
      </Link>
    )
  }

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex items-center border-t border-border bg-background/95 px-2 pt-2 pb-[max(env(safe-area-inset-bottom),8px)] backdrop-blur md:hidden"
      )}
    >
      {items.slice(0, middle).map(tab)}
      <div className="flex flex-1 items-center justify-center">
        <button
          type="button"
          onClick={onCompose}
          aria-label={
            ghostActive
              ? "Post anonymously. Ghost Hour is live"
              : "Post a snacc"
          }
          className="flex h-11 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground active:scale-95"
        >
          {ghostActive ? (
            <GhostIcon className="size-7" />
          ) : (
            <PlusIcon className="size-7" />
          )}
        </button>
      </div>
      {items.slice(middle).map(tab)}
    </nav>
  )
}
