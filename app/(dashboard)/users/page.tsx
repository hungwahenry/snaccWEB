"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { UsersTable } from "@/features/users/users-table"
import { useUsers } from "@/features/users/use-users"
import type { ListUsersParams } from "@/features/users/types"

export default function UsersPage() {
  const [params, setParams] = useState<ListUsersParams>({ page: 1, perPage: 20 })
  const query = useUsers(params)

  function patch(next: Partial<ListUsersParams>) {
    setParams((prev) => ({ ...prev, ...next }))
  }

  return (
    <>
      <PageHeader title="Users" description="Search, inspect and moderate accounts." />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-muted-foreground text-sm">Couldn&apos;t load users.</p>
      ) : (
        <UsersTable data={query.data} params={params} onParams={patch} />
      )}
    </>
  )
}
