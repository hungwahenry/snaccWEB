"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserActivityTab } from "./user-activity-tab"
import { UserManagePanel } from "./user-manage-panel"
import { UserMoneyTab } from "./user-money-tab"
import { UserOverviewTab } from "./user-overview-tab"
import type { AdminUserDetail } from "./types"
import type { useUserMutations } from "./use-users"

function StatusBadges({ user }: { user: AdminUserDetail }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {user.role === "admin" ? (
        <Badge>admin</Badge>
      ) : (
        <Badge variant="outline">user</Badge>
      )}
      {user.suspended_at && <Badge variant="destructive">suspended</Badge>}
      {user.posts_globally && <Badge>posts everywhere</Badge>}
      {user.earnings_paused_at && (
        <Badge variant="secondary">earnings paused</Badge>
      )}
      {user.payouts_blocked_at && (
        <Badge variant="secondary">payouts blocked</Badge>
      )}
    </div>
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Avatar className="size-16 shrink-0">
          <AvatarImage src={user.avatar_url} alt="" />
          <AvatarFallback>
            {(user.display_name || user.username || user.email)
              .slice(0, 2)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-xl font-semibold">
              {user.display_name ?? "—"}
            </h2>
            <StatusBadges user={user} />
          </div>
          <p className="truncate text-sm text-muted-foreground">
            {user.username ? `@${user.username} · ` : ""}
            {user.email}
          </p>
          {user.university && (
            <p className="truncate text-sm text-muted-foreground">
              {user.university.name}
            </p>
          )}
        </div>
      </div>

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
