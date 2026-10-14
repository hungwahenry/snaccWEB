"use client"

import { BackLink } from "@/features/admin/shell/components/back-link"
import { QueryView } from "@/features/admin/shell/components/query-view"
import { USERS_PATH } from "@/features/admin/shell/routes"
import { UserActivityTab } from "../components/user-activity-tab"
import { UserDetail } from "../components/user-detail"
import { UserManageTab } from "../components/user-manage-tab"
import { UserMoneyTab } from "../components/user-money-tab"
import { UserOverviewTab } from "../components/user-overview-tab"
import { useUserDetailScreen } from "../hooks/use-user-detail-screen"

export function UserDetailScreen({ id }: { id: string }) {
  const screen = useUserDetailScreen(id)

  return (
    <>
      <BackLink href={USERS_PATH} label="Back to users" />
      <QueryView query={screen.query} what="this account">
        {(user) => (
          <UserDetail
            user={user}
            tab={screen.tab}
            onTabChange={(tab) => void screen.setTab(tab)}
            panels={{
              overview: <UserOverviewTab user={user} />,
              manage: (
                <UserManageTab
                  user={user}
                  actions={screen.actions}
                  suspension={screen.suspension}
                  roles={screen.roles}
                />
              ),
              money: (
                <UserMoneyTab
                  user={user}
                  onGivePremium={(input) => screen.premium.grant(id, input)}
                  onEndPremium={() => screen.premium.revoke(id)}
                />
              ),
              activity: <UserActivityTab user={user} />,
            }}
          />
        )}
      </QueryView>
    </>
  )
}
