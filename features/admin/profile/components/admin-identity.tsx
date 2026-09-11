import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/ui/user-avatar"
import { HOME_PATH } from "@/features/feed/routes"
import type { User } from "@/features/users/types"
import { nameOf } from "@/features/users/utils/names"

export function AdminIdentity({ account }: { account: User }) {
  const { profile } = account

  return (
    <div className="flex items-center gap-4">
      <UserAvatar
        alt={profile?.display_name ?? "You"}
        avatarUrl={profile?.avatar_url}
        name={profile?.username}
        className="size-14"
        textClassName="text-lg"
      />
      <div className="min-w-0">
        <p className="truncate font-semibold">
          {profile ? nameOf(profile, account.email) : account.email}
        </p>
        <p className="truncate text-sm text-muted-foreground">
          {account.email}
        </p>
      </div>
      <div className="ml-auto">
        <Button variant="outline" size="sm" render={<Link href={HOME_PATH} />}>
          Back to Snacc
        </Button>
      </div>
    </div>
  )
}
