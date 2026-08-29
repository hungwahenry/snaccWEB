"use client"

import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { RolesTable } from "@/features/admin/roles/components/roles-table"
import {
  useRoleMutations,
  useRoles,
} from "@/features/admin/roles/hooks/use-roles"

export default function RolesPage() {
  const query = useRoles()
  const mutations = useRoleMutations()

  return (
    <>
      <PageHeader
        title="Roles"
        description="Bundles of permissions you can grant to admins."
      />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t load roles.
        </p>
      ) : (
        <RolesTable roles={query.data} mutations={mutations} />
      )}
    </>
  )
}
