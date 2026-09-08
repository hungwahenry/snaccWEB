import {
  EllipsisIcon,
  GhostIcon,
  LogOutIcon,
  PlusIcon,
  SettingsIcon,
} from "lucide-react"
import Link from "next/link"
import { Wordmark } from "@/components/marketing/wordmark"
import { CountBadge } from "@/components/ui/count-badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAvatar } from "@/components/ui/user-avatar"
import { cn } from "@/lib/utils"
import type { NavItem } from "@/features/navigation/types"
import { NavAvatar } from "./nav-avatar"

type SidebarProps = {
  items: NavItem[]
  activeKey: string | null
  ghostActive: boolean
  user: {
    avatarUrl: string | null
    name: string | null
    username: string | null
  } | null
  onCompose: () => void
  onSettings: () => void
  onLogout: () => void
}

export function Sidebar({
  items,
  activeKey,
  ghostActive,
  user,
  onCompose,
  onSettings,
  onLogout,
}: SidebarProps) {
  return (
    <div className="flex h-full flex-col items-center gap-1 px-2 py-3 wide:items-stretch wide:px-3">
      <div className="flex h-12 items-center justify-center wide:justify-start wide:px-3">
        <Wordmark href="/home" height={26} />
      </div>

      <nav className="mt-2 flex flex-col gap-1">
        {items.map((item) => {
          const active = item.key === activeKey
          const Icon = item.icon

          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={active ? "page" : undefined}
              aria-label={item.label}
              className={cn(
                "group flex h-12 items-center gap-4 rounded-full px-3 transition-colors hover:bg-accent wide:pr-6",
                active ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <span className="relative flex size-7 items-center justify-center">
                {item.avatarUrl !== undefined ? (
                  <NavAvatar
                    avatarUrl={item.avatarUrl}
                    fallback={item.avatarFallback ?? "?"}
                    active={active}
                  />
                ) : (
                  <Icon className={cn("size-7", active && "stroke-[2.5]")} />
                )}
                {item.badge ? <CountBadge count={item.badge} /> : null}
              </span>
              <span
                className={cn(
                  "hidden text-lg wide:block",
                  active ? "font-extrabold" : "font-medium"
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      <button
        type="button"
        onClick={onCompose}
        aria-label={
          ghostActive ? "Post anonymously. Ghost Hour is live" : "Post a snacc"
        }
        className="mt-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-[1.02] active:scale-95 wide:w-full wide:gap-2 wide:px-6"
      >
        {ghostActive ? (
          <GhostIcon className="size-6" />
        ) : (
          <PlusIcon className="size-6" />
        )}
        <span className="hidden text-base font-extrabold wide:block">
          Snacc
        </span>
      </button>

      <div className="flex-1" />

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Account menu"
            className="flex h-14 items-center gap-3 rounded-full px-2 transition-colors hover:bg-accent wide:px-3"
          >
            <UserAvatar
              alt={user.name ?? "You"}
              avatarUrl={user.avatarUrl}
              name={user.username}
              className="size-9"
            />
            <span className="hidden min-w-0 flex-1 flex-col text-left wide:flex">
              <span className="truncate text-sm font-extrabold text-foreground">
                {user.name ?? user.username}
              </span>
              {user.username ? (
                <span className="truncate text-sm text-muted-foreground">
                  @{user.username}
                </span>
              ) : null}
            </span>
            <EllipsisIcon className="hidden size-5 text-muted-foreground wide:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="min-w-56">
            <DropdownMenuItem onClick={onSettings}>
              <SettingsIcon /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onLogout}>
              <LogOutIcon /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  )
}
