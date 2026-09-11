"use client"

import { Fact, Facts, Section } from "@/features/admin/shell/components/detail"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { QueryView } from "@/features/admin/shell/components/query-view"
import { formatDate } from "@/lib/format"
import { AdminIdentity } from "../components/admin-identity"
import { HeldRoles } from "../components/held-roles"
import { PermissionList } from "../components/permission-list"
import { useProfileScreen } from "../hooks/use-profile-screen"
import { permissionsSummary } from "../utils/access"

export function AdminProfileScreen() {
  const { me, grants, groups } = useProfileScreen()

  return (
    <>
      <PageHeader
        title="Your access"
        description="Who this panel thinks you are, and what that lets you do."
      />
      <QueryView query={me} what="your account">
        {(account) => (
          <div className="flex flex-col gap-6">
            <AdminIdentity account={account} />

            <Section title="Account">
              <Facts>
                <Fact
                  label="Username"
                  value={account.profile?.username ?? "—"}
                />
                <Fact
                  label="Campus"
                  value={account.profile?.university?.name ?? "—"}
                />
                <Fact label="Joined" value={formatDate(account.created_at)} />
              </Facts>
            </Section>

            <Section
              title="Roles"
              description="Access comes from these. An owner asks another owner to change them."
            >
              <HeldRoles grants={grants} />
            </Section>

            <Section
              title="Permissions"
              description={permissionsSummary(account.permissions)}
            >
              <PermissionList groups={groups} />
            </Section>
          </div>
        )}
      </QueryView>
    </>
  )
}
