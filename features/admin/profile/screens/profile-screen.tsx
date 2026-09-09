"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { UserAvatar } from "@/components/ui/user-avatar"
import { useMe } from "@/features/auth/hooks/use-me"
import { usePermissions } from "@/features/admin/roles/hooks/use-roles"
import { useUserRoles } from "@/features/admin/roles/hooks/use-user-roles"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { Fact, Facts, Section } from "@/features/admin/shell/ui/detail"
import { formatDate } from "@/lib/format"
import { PermissionList } from "../components/permission-list"

export function AdminProfileScreen() {
  const me = useMe()
  const grants = useUserRoles(me.data?.id ?? "")
  const catalog = usePermissions()

  if (me.isPending || !me.data) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    )
  }

  const { profile, permissions } = me.data
  const held = grants.data ?? []

  return (
    <>
      <PageHeader
        title="Your access"
        description="Who this panel thinks you are, and what that lets you do."
      />

      <div className="flex flex-col gap-6">
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
              {profile?.display_name ?? profile?.username ?? me.data.email}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {me.data.email}
            </p>
          </div>
          <div className="ml-auto">
            <Button variant="outline" size="sm" render={<Link href="/home" />}>
              Back to Snacc
            </Button>
          </div>
        </div>

        <Section title="Account">
          <Facts>
            <Fact label="Username" value={profile?.username ?? "—"} />
            <Fact label="Campus" value={profile?.university?.name ?? "—"} />
            <Fact label="Joined" value={formatDate(me.data.created_at)} />
          </Facts>
        </Section>

        <Section
          title="Roles"
          description="Access comes from these. An owner asks another owner to change them."
        >
          {held.length === 0 ? (
            <p className="text-sm text-muted-foreground">No roles held.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {held.map((grant) => (
                <Badge
                  key={grant.id}
                  variant={grant.role.allow_all ? "default" : "outline"}
                >
                  {grant.role.name}
                  {grant.scope_type ? ` · ${grant.scope_type}` : ""}
                </Badge>
              ))}
            </div>
          )}
        </Section>

        <Section
          title="Permissions"
          description={
            permissions.all
              ? "Full access. Every permission below, including any added later."
              : `${permissions.keys.length} permission${permissions.keys.length === 1 ? "" : "s"}, and only these.`
          }
        >
          <PermissionList
            keys={
              permissions.all
                ? (catalog.data ?? []).map((permission) => permission.key)
                : permissions.keys
            }
          />
        </Section>
      </div>
    </>
  )
}
