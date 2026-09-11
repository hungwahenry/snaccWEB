import type { ReactNode } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserAvatar } from "@/components/ui/user-avatar"
import { DetailHeader } from "@/features/admin/shell/components/detail"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import { userInitialSource, userName } from "@/features/admin/shell/utils/user"
import { formatDate } from "@/lib/format"
import type { AdminUserDetail } from "../types"
import {
  userBadges,
  userSubtitle,
  USER_TABS,
  type UserTab,
} from "../utils/users"

const TAB_LABELS: Record<UserTab, string> = {
  overview: "Overview",
  manage: "Manage",
  money: "Money",
  activity: "Activity",
}

export function UserDetail({
  user,
  tab,
  onTabChange,
  panels,
}: {
  user: AdminUserDetail
  tab: UserTab
  onTabChange: (tab: UserTab) => void
  panels: Record<UserTab, ReactNode>
}) {
  return (
    <div className="flex flex-col gap-6">
      <DetailHeader
        leading={
          <UserAvatar
            avatarUrl={user.avatar_url}
            name={userInitialSource(user)}
            alt=""
            className="size-14"
            textClassName="text-lg"
          />
        }
        title={userName(user)}
        badges={userBadges(user).map((badge) => (
          <StatusBadge key={badge.label} status={badge} />
        ))}
        subtitle={userSubtitle(user)}
        meta={
          <>
            {user.university ? <span>{user.university.name}</span> : null}
            <span>Joined {formatDate(user.created_at)}</span>
          </>
        }
      />

      <Tabs value={tab} onValueChange={(next) => onTabChange(next as UserTab)}>
        <TabsList>
          {USER_TABS.map((key) => (
            <TabsTrigger key={key} value={key}>
              {TAB_LABELS[key]}
            </TabsTrigger>
          ))}
        </TabsList>
        {USER_TABS.map((key) => (
          <TabsContent key={key} value={key} className="pt-4">
            {panels[key]}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
