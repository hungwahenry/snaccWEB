"use client"

import { useUsersScreen } from "@/features/admin/users/hooks/use-users-screen"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { UsersTable } from "@/features/admin/users/components/users-table"

export function UsersScreen() {
  const { params, patch, query } = useUsersScreen()

  return (
    <>
      <PageHeader
        title="Users"
        description="Search, inspect and moderate accounts."
      />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t load users.
        </p>
      ) : (
        <UsersTable data={query.data} params={params} onParams={patch} />
      )}
    </>
  )
}
