"use client"

import { DetailHeader } from "@/components/admin/detail"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserActivityTab } from "./user-activity-tab"
import { UserManagePanel } from "./user-manage-panel"
import { UserMoneyTab } from "./user-money-tab"
import { UserOverviewTab } from "./user-overview-tab"
import { formatDate } from "@/lib/format"
import type { AdminUserDetail } from "./types"
import type { useUserMutations } from "./use-users"

function StatusBadges({ user }: { user: AdminUserDetail }) {
  return (
    <>
      {user.role === "admin" ? (
        <Badge>admin</Badge>
      ) : (
        <Badge variant="outline">user</Badge>
      )}
      {user.suspended_at ? (
        <Badge variant="destructive">suspended</Badge>
      ) : null}
      {user.posts_globally ? <Badge>posts everywhere</Badge> : null}
      {user.earnings_paused_at ? (
        <Badge variant="secondary">earnings paused</Badge>
      ) : null}
      {user.payouts_blocked_at ? (
        <Badge variant="secondary">payouts blocked</Badge>
      ) : null}
    </>
  )
}

export function UserDetail({
  user,
  actions,
}: {
  user: AdminUserDetail
  actions: ReturnType<typeof useUserMutations>
}) {
  return (
    <div className="flex flex-col gap-6">
      <DetailHeader
        leading={
          <Avatar className="size-14">
            <AvatarImage src={user.avatar_url} alt="" />
            <AvatarFallback>
              {(user.display_name || user.username || user.email)
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        }
        title={user.display_name ?? user.username ?? "Unnamed"}
        badges={<StatusBadges user={user} />}
        subtitle={`${user.username ? `@${user.username} · ` : ""}${user.email}`}
        meta={
          <>
            {user.university ? <span>{user.university.name}</span> : null}
            <span>Joined {formatDate(user.created_at)}</span>
          </>
        }
      />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
          <TabsTrigger value="money">Money</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <UserOverviewTab user={user} />
        </TabsContent>
        <TabsContent value="manage">
          <UserManagePanel user={user} actions={actions} />
        </TabsContent>
        <TabsContent value="money">
          <UserMoneyTab user={user} />
        </TabsContent>
        <TabsContent value="activity">
          <UserActivityTab user={user} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
