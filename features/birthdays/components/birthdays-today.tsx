import { Eyebrow } from "@/components/ui/eyebrow"
import { UserAvatar } from "@/components/ui/user-avatar"
import type { FollowUser } from "@/features/follows/types"
import { ProfileLink } from "@/features/users/components/profile-link"
import { nameOf } from "@/features/users/utils/names"

export function BirthdaysToday({ celebrants }: { celebrants: FollowUser[] }) {
  if (celebrants.length === 0) return null

  return (
    <section className="flex flex-col gap-2.5">
      <Eyebrow className="px-1">Birthdays today</Eyebrow>
      <div className="-mx-(--gutter) flex [scrollbar-width:none] gap-3.5 overflow-x-auto px-[calc(var(--gutter)+4px)] [&::-webkit-scrollbar]:hidden">
        {celebrants.map((user) => (
          <ProfileLink
            key={user.id}
            username={user.username}
            className="flex w-[92px] shrink-0 flex-col items-center gap-1.5 transition-opacity active:opacity-70"
          >
            <span className="relative">
              <UserAvatar
                alt={nameOf(user)}
                className="size-16"
                avatarUrl={user.avatar_url}
                name={user.username}
              />
              <span className="absolute -right-1 -bottom-1 text-base">🎂</span>
            </span>
            <span className="w-full truncate text-center text-xs font-bold text-foreground">
              {nameOf(user)}
            </span>
          </ProfileLink>
        ))}
      </div>
    </section>
  )
}
